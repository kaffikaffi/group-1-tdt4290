import json
import spacy
import random
import csv

filename = "sample-21_09_21"

intentSampleLists = {
    "DefineIssuerIncorperationPlace": [],
    "DefineInstrumentMaturityDate": [],
    "DefineIssuerName": [],
    "DefineDenomination": [],
    "DefineInstrumentMaxAmount": [],
    "DefineInstrumentFirstAmount": [],
    "DefineAgent": [],
    "Irrelevant": []
}


def getDocProgressionStatusLabel(prog):
    if prog < 0.1:
        return "_SS "
    elif prog < 0.2:
        return "_SM "
    elif prog < 0.5:
        return "_MM "
    elif prog < 0.8:
        return "_ME "
    elif prog < 0.9:
        return "_MEE "
    else:
        return "_EE "


def checkIndexOverlap(i, added_indexes):
    for indexes in added_indexes:
        if indexes[0] <= i <= indexes[1]:
            return True

    return False


with open("./doccano_exports/" + filename + ".jsonl", 'r', encoding="utf-8") as rf:
    Lines = rf.readlines()
    nlp = spacy.load("en_core_web_sm")
    for line in Lines:
        lineObject = json.loads(line)
        pickedIndexes = []

        if "data" in lineObject and len(lineObject["data"]) > 0 and "label" in lineObject and len(
                lineObject["label"]) > 0:
            for label in lineObject["label"]:

                if not label[2] in intentSampleLists:
                    print("Failed to find label in predefined valid intents -> aborting.")
                    continue

                # extracting surrounding sentence(s)
                startIndex = label[0]
                endIndex = label[1]

                while startIndex > 0:
                    if lineObject["data"][startIndex] == '.' or lineObject["data"][startIndex] == '\n':
                        # adding one to startIndex to avoid passing on end-char from prev sentence.
                        startIndex += 1
                        break
                    startIndex -= 1

                while endIndex < len(lineObject["data"]):
                    if lineObject["data"][endIndex] == '.' or lineObject["data"][endIndex] == '\n':
                        break
                    endIndex += 1

                print("start index found to be:", startIndex, "and end index found to be:", endIndex)

                # The format expected in the RASA training files does not allow line-shifts,
                # current solution simply removes them.
                markedUtterance = lineObject["data"][startIndex:endIndex].replace("\n", " ")

                # Adding document progression status field.
                progression = startIndex / len(lineObject["data"])
                markedUtterance = getDocProgressionStatusLabel(progression) + markedUtterance

                print("adding \"" + markedUtterance + "\" to sample list for", label[2])
                intentSampleLists[label[2]].append(markedUtterance)
                pickedIndexes.append([startIndex, endIndex])

        # finding a couple (currently 2-3) examples of "CATCHALL"-label sentences in every document
        doc = nlp(lineObject["data"])

        index = 0
        addCount = 0
        sentences = []
        for sent in doc.sents:
            sentences.append(sent)

        for sent in sentences:
            stripped = sent.text.strip(' \t\n\r')
            if len(stripped) > 5 and not checkIndexOverlap(index, pickedIndexes) \
                    and random.randrange(0, len(sentences)) < (2 if len(stripped) > 10 else 3):
                markedUtterance = sent.text.replace("\n", " ")

                if len(markedUtterance) > 5:
                    # Adding document progression status field.
                    progression = index / len(lineObject["data"])
                    markedUtterance = getDocProgressionStatusLabel(progression) + markedUtterance

                    print("adding \"" + markedUtterance + "\" to sample list for Irrelevant")
                    intentSampleLists["Irrelevant"].append(markedUtterance)
                    addCount += 1

            index += len(sent.text)


with open("./doccano_exports/" + filename + ".yml", 'w', encoding="utf-8") as wf:
    with open("./doccano_exports/" + filename + ".csv", 'w', newline='', encoding="utf-8") as wfcsv:
        wf.write("version: \"2.0\"\n\nnlu:\n")
        csvwriter = csv.writer(wfcsv, delimiter=',')
        csvwriter.writerow(["text", "label"])

        for intent in intentSampleLists.keys():
            wf.write("- intent: " + intent + "\n  examples: |\n")
            for sample in intentSampleLists[intent]:
                # the below replacement is necessary due to the yml format of the training data.
                ysample = sample
                csample = sample
                if ":" in ysample:
                    ysample = "\"" + ysample.replace("\"", "\\\"") + "\""

                wf.write("    - " + ysample + "\n")

                # if "\"" in csample:
                #     csample = "\"" + csample.replace("\"", "\\\"") + "\""
                # elif "," in sample:
                #     csample = "\"" + csample.replace("\"", "\\\"") + "\""

                csvwriter.writerow([csample, intent])

