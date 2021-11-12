import time

import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
import yaml
from rasa.shared.nlu.training_data.formats.rasa_yaml import RasaYAMLReader, RasaYAMLWriter
from rasa.shared.nlu.training_data.message import Message

import config

HOST = config.settings['host']
MASTER_KEY = config.settings['master_key']
DATABASE_ID = config.settings['database_id']
CONTAINER_ID = config.settings['container_id']

out_file = "./training_data.yml"

yamlReader = RasaYAMLReader()
yamlWriter = RasaYAMLWriter()


def retrieve_remote_data(timestamp=None):
    if timestamp is None:
        timestamp = 0

    client = cosmos_client.CosmosClient(HOST,
                                        {'masterKey': MASTER_KEY},
                                        user_agent="CosmosDBPythonQuickstart",
                                        user_agent_overwrite=True)

    try:
        db = client.get_database_client(DATABASE_ID)
        collection = db.get_container_client(CONTAINER_ID)

        print("retrieving with timestamp: " + str(timestamp))

        # Including the partition key value of account_number in the WHERE filter results in a more efficient query
        items = list(collection.query_items(
            query="SELECT * FROM r WHERE r.timestamp > @timestamp",
            parameters=[
                {"name": "@timestamp", "value": timestamp}
            ],
            enable_cross_partition_query=True
        ))
        print(items)
        return items

    except exceptions.CosmosHttpResponseError as e:
        print('\nrun_sample has caught an error. {0}'.format(e.message))

    return []


with open(out_file, 'r+', encoding="utf-8") as of:
    full_file_string = of.read()

    ld = yaml.safe_load(full_file_string)
    last_updated_datetime_utc = 0
    if ld is not None and ld.get("last-updated-unix") is not None:
        last_updated_datetime_utc = ld.get("last-updated-unix")

    training_data = yamlReader.reads(full_file_string)

    print("old last updated datetime (utc): " + str(last_updated_datetime_utc))
    data_list = retrieve_remote_data(timestamp=last_updated_datetime_utc)

    for processed_document in data_list:
        if processed_document["processed_sentences"] is not None:
            print("processed_document:")
            print(processed_document)
            training_data.training_examples.extend([Message(data={
                "text": d["progressionTag"] + " " + d["text"].replace("\n", " "),
                "intent": d["classification"]["name"]
            }) for d in processed_document["processed_sentences"]])

    last_updated_datetime_utc = time.time() * 1000

    of.seek(0)
    of.write(yamlWriter.dumps(training_data))
    of.write("last-updated-unix: " + str(last_updated_datetime_utc))
    of.truncate()
    of.close()
    # yaml.dump(existing_file_data, of)
