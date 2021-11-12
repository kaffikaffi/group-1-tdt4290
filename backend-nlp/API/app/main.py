import secrets

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import nltk.data
import os
from rasa.cli.utils import get_validated_path
from rasa.model import get_model, get_model_subdirectories
from rasa.nlu.model import Interpreter
from azure.storage.blob import BlobClient
import config

conn_str = config.settings["blob_connection_string"]
container_name = "models"

shipped_backup_model_path = os.path.join(os.path.dirname(__file__), "shipped_models/real_serious_backup_model.tar.gz")
prod_model_path = os.path.join(os.path.dirname(__file__), "models/newest_model.tar.gz")
backup_model_file_path = os.path.join(os.path.dirname(__file__), "models/backup_model.tar.gz")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Just allow from everywhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
simple_security = HTTPBasic()


class FulltextRequest(BaseModel):
    text_snippet: str
    total_text_length: int  # in chars
    start_index_sent: int
    start_index_char: int


class ReplaceModelRequest(BaseModel):
    new_model_name: str


def load_most_applicable_model(use_shipped_backup=False):
    model_path = shipped_backup_model_path
    if not use_shipped_backup:
        if os.path.exists(prod_model_path):
            model_path = prod_model_path
        elif os.path.exists(backup_model_file_path):
            model_path = backup_model_file_path

    print("loading model from path: " + model_path)

    model = get_validated_path(model_path, "model")
    validated_model_path = get_model(model)
    _, nlu_model = get_model_subdirectories(validated_model_path)

    try:
        tmp_interpreter = Interpreter.load(nlu_model)  # this should be an extracted model
    except Exception as e:
        print("Error Encountered loading new model -> handling and loading a backup.")
        print(e)
        # If prod_model is broken, removing and retrying
        if model_path == prod_model_path:
            os.remove(model_path)
            return load_most_applicable_model()
        elif use_shipped_backup:
            return None

        # neither backup_model nor newest_model works, using shipped_backup.
        return load_most_applicable_model(True)

    return tmp_interpreter


def make_prod_model_backup():
    # No backup anyways - no need to let that stop us then
    if not os.path.exists(prod_model_path):
        return True

    try:
        # copying prod_model to backup_model, replacing existing backup_model if one exists
        os.replace(prod_model_path, backup_model_file_path)
        return True
    except Exception as e:
        # Current policy is to abort model replacement if prod_model cannot be moved to backup-file.
        print("Exception encountered while making prod backup model")
        print(e)
        return False


def retrieve_remote_model(blob_name):
    print("Attempting to download remote model...")

    blob = BlobClient.from_connection_string(conn_str=conn_str, container_name="models", blob_name=blob_name)

    if not blob.exists():
        return 1

    # Making backup of current prod_model (or, basically just renaming without collision)
    if make_prod_model_backup():
        try:
            with open(prod_model_path, "wb") as model_blob:
                blob = blob.download_blob()
                print("Blob retrieved: ", blob)
                blob.readinto(model_blob)

            return 0
        except Exception as e:
            print("Error occurred - reverting back to old prod_model...")
            print(e)
            os.replace(backup_model_file_path, prod_model_path)

    return 2


nltk.download('punkt')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

interpreter = load_most_applicable_model()


def get_doc_progression_status_label(progression):
    if progression < 0.1:
        return "_SS "
    elif progression < 0.2:
        return "_SM "
    elif progression < 0.5:
        return "_MM "
    elif progression < 0.8:
        return "_ME "
    elif progression < 0.9:
        return "_MEE "
    else:
        return "_EE "


def get_processed_sentences_from_text(request: FulltextRequest):
    if interpreter is None:
        return []

    # Splitting up text into it's own sentences
    unprocessed_sentences = tokenizer.tokenize(request.text_snippet)
    processed_sentences = []

    c_index = request.start_index_char
    t_index = request.start_index_sent
    for unprocessed_sentence in unprocessed_sentences:

        progression = c_index / request.total_text_length
        doc_progression_tag = get_doc_progression_status_label(progression)

        sent_text = doc_progression_tag + " " + unprocessed_sentence

        # Currently skipping all "sentences" that contain less than 3 non-whitespace characters.
        if len(re.sub(r"[ \t\n\r]+", "", unprocessed_sentence)) > 3:
            result = interpreter.parse(sent_text)

            entities = [
                {
                    "entity": entity["entity"],
                    "value": entity["value"],
                    "start": entity["start"],
                    "end": entity["start"]
                }
                for entity in result["entities"]
            ]

            processed_sentences.append({
                "index": t_index,
                "text": result["text"][len(doc_progression_tag) + 1:],
                "classification": result["intent"],
                "entities": entities,
                "progressionTag": doc_progression_tag,
            })

        c_index += len(unprocessed_sentence)
        t_index += 1

    return {
        "processed_sentences": processed_sentences,
        "latest_c_index": c_index,
        "latest_t_index": t_index,
    }


def check_credentials(credentials: HTTPBasicCredentials):
    # Simple security check (only one, hardcoded, user present at the moment)
    correct_username = secrets.compare_digest(credentials.username, config.user_credentials["username"])
    correct_password = secrets.compare_digest(credentials.password, config.user_credentials["password"])
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/password combo",
            headers={"WWW-Authenticate": "Basic"},
        )


@app.get("/")
async def root():
    return {"message": "Hello from LegFin"}


@app.post("/fulltext")
async def fulltext(request: FulltextRequest, credentials: HTTPBasicCredentials = Depends(simple_security)):
    check_credentials(credentials)

    # User authenticated -> performing NLP and returning the processed sentences.
    return get_processed_sentences_from_text(request)


@app.post("/replace_prod_model")
async def replace_prod_model(request: ReplaceModelRequest, credentials: HTTPBasicCredentials = Depends(simple_security)):
    check_credentials(credentials)

    # retrieving model
    retrieve_model_result = retrieve_remote_model(request.new_model_name)
    if retrieve_model_result == 0:
        # Loading the new interpreter (should be picked automatically now)
        global interpreter
        interpreter = load_most_applicable_model()

        return {
            "message": "prod model successfully updated",
            "loaded_model_name": request.new_model_name,
        }
    elif retrieve_model_result == 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not find requested model in remote container.",
        )

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="prod model could not be updated.",
    )

