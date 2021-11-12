import json
import spacy
import random
import csv

filenames = ["test", "train"]


for filename in filenames:

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

    with open("./August/" + filename + ".csv", mode='r', encoding="utf-8") as rf:
        csv_reader = csv.reader(rf, delimiter=',')

        for row in csv_reader:
            if row[1] in intentSampleLists:
                intentSampleLists[row[1]].append(row[0])

    with open("./August/" + filename + ".yml", 'w', encoding="utf-8") as wf:
        wf.write("version: \"2.0\"\n\nnlu:\n")

        for intent in intentSampleLists.keys():
            wf.write("- intent: " + intent + "\n  examples: |\n")
            for sample in intentSampleLists[intent]:
                # the below replacement is necessary due to the yml format of the training data.
                if ":" in sample:
                    sample = "\"" + sample.replace("\"", "\\\"") + "\""

                wf.write("    - " + sample + "\n")


