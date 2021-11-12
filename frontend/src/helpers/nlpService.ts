import axios from "axios";
import stringSimilarity from "string-similarity";
import {
	IDigest,
	IDigestField,
	IEntity,
	IProcessedData,
	IProcessedSentence,
} from "../types/interfaces";

const API_URL = process.env.REACT_APP_API_URL;
const ENDPOINT_TEXT = "/fulltext";

const possibleCompanyTypes: string[] = ["AS", "A/S", "AB", "Ltd", "PLC", "LLP"];
const possibleCurrencies = ["EURO", "POUNDS", "DOLLAR", "KRONER", "AFN", "ALL", "DZD", "AOA", "ARS",
              "AMD", "AWG", "AUD", "AZN", "BSD", "BHD", "BDT", "BBD", "BYN", "BZD", "BMD", "BTN", "BOB",
              "BAM", "BWP", "BRL", "BND", "BGN", "BIF", "KHR", "CAD", "CVE", "KYD", "CLP", "CNY", "COP",
              "XOF", "XAF", "KMF", "XPF", "CDF", "CRC", "HRK", "CUC", "CUP", "CZK", "DKK", "DJF", "DOP",
              "XCD", "EGP", "SVC", "ERN", "SZL", "ETB", "EUR", "FKP", "FJD", "GMD", "GEL", "GHS", "GIP",
              "GTQ", "GGP", "GNF", "GYD", "HTG", "HNL", "HKD", "HUF", "ISK", "INR", "IDR", "XDR", "IRR",
              "IQD", "IMP", "ILS", "JMD", "JPY", "JEP", "JOD", "KZT", "KES", "KPW", "KRW", "KWD", "KGS",
              "LAK", "LBP", "LSL", "LRD", "LYD", "MOP", "MKD", "MGA", "MWK", "MYR", "MVR", "MRU", "MUR",
              "MXN", "MDL", "MNT", "MAD", "MZN", "MMK", "NAD", "NPR", "ANG", "NZD", "NIO", "NGN", "NOK",
              "OMR", "PKR", "PAB", "PGK", "PYG", "PEN", "PHP", "PLN", "QAR", "RON", "RUB", "RWF", "SHP",
              "WST", "SAR", "SPL", "RSD", "SCR", "SLL", "SGD", "SBD", "SOS", "ZAR", "LKR", "SDG", "SRD",
              "SEK", "CHF", "SYP", "STN", "TWD", "TJS", "TZS", "THB", "TOP", "TTD", "TND", "TRY", "TMT",
              "TVD", "UGX", "UAH", "AED", "GBP", "USD", "UYU", "UZS", "VUV", "VEF", "VND", "YER", "ZMW",
              "ZWD"];

class NLPService {
	/**
	 * Processes text
	 * @param text text that should be processed
	 * @returns AxtiosResponse
	 */
	public processText = async (
		_text_snippet: string,
		_total_text_length: number,
		_start_index_sent: number,
		_start_index_char: number,
		username: string,
		password: string
	): Promise<IProcessedData | undefined> => {
		// Instantiate variabel for storing response
		let response: IProcessedData | undefined;

		// Prepare payload for request
		const payload = {
			text_snippet: _text_snippet,
			total_text_length: _total_text_length,
			start_index_sent: _start_index_sent,
			start_index_char: _start_index_char,
		};

		const config = {
			headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
		};

		// Make api request
		const res: any = await axios.post(API_URL + ENDPOINT_TEXT, payload, config);

		// Check if api request was successfull
		if (res.data?.processed_sentences) {
			response = res.data; // Set response data
		} else {
			console.log(res.data); // Log data for debugging
		}

		// Return response data or failed request
		return response;
	};

	/**
	 * Generates digest data from processed sentences
	 * @param processed_sentences processed sentences from NLP
	 * @returns Returns digest data from processed sentences
	 */
	public processDigest = (processed_sentences: IProcessedSentence[]) => {
		const digest: IDigest = {
			issuerName: [],
			issuerIncorporationPlace: [],
			agent: [],
			denomination: [],
			instrumentAmount: [],
			instrumentMaturityDate: [],
		};

		// Loop through all processed sentences
		for (let i = 0; i < processed_sentences.length; i++) {
			const sent = processed_sentences[i]; // Fetch processed sentence

			// If classification is irrelevant, digest processing is unecessary
			if (
				sent.classification.name === "Irrelevant" ||
				sent.classification.name === "IrrelevantX"
			) {
				// Nothing
			} else if (sent.classification.name === "DefineIssuerInfo") {
				// Loop through all entities from processed sentence
				for (let j = 0; j < sent.entities.length; j++) {
					const entity = sent.entities[j]; // Fetch entity

					// Check if ORG or PERSON is contained within the entity
					if (entity.entity === "ORG" || entity.entity === "PERSON") {
						// Add entity to digest
						digest.issuerName = this.addToDigest(
							digest.issuerName,
              "issuerName",
							entity,
							sent.index
						);
					}

					// Check if ORG or PERSON is contained within the entity
					if (
						entity.entity === "FAC" ||
						entity.entity === "GPE" ||
						entity.entity === "NORP"
					) {
						// Add entity to digest
						digest.issuerIncorporationPlace = this.addToDigest(
							digest.issuerIncorporationPlace,
              "issuerIncorporationPlace",
							entity,
							sent.index
						);
					}
				}
			} else if (sent.classification.name === "DefineInstrumentMaturityDate") {
				// Loop through all entities from processed sentence
				for (let j = 0; j < sent.entities.length; j++) {
					const entity = sent.entities[j]; // Fetch entity

					// Check if ORG or PERSON is contained within the entity
					if (entity.entity === "DATE") {
						// Add entity to digest
						digest.instrumentMaturityDate = this.addToDigest(
							digest.instrumentMaturityDate,
              "instrumentMaturityDate",
							entity,
							sent.index
						);
					}
				}
			} else if (sent.classification.name === "DefineAgent") {
				// Loop through all entities from processed sentence
				for (let j = 0; j < sent.entities.length; j++) {
					const entity = sent.entities[j]; // Fetch entity

					// Check if ORG or PERSON is contained within the entity
					if (entity.entity === "ORG" || entity.entity === "PERSON") {
						// Add entity to digest
						digest.agent = this.addToDigest(digest.agent, "agent", entity, sent.index);
					}
				}
			} else if (sent.classification.name === "DefineDenomination") {
				// Loop through all entities from processed sentence
				for (let j = 0; j < sent.entities.length; j++) {
					const entity = sent.entities[j]; // Fetch entity

					// Check if ORG or PERSON is contained within the entity
					if (entity.entity === "MONEY" || entity.entity === "ORDINAL") {
						// Add entity to digest
						digest.denomination = this.addToDigest(
							digest.denomination,
              "denomination",
							entity,
							sent.index
						);
					}
				}
			} else if (sent.classification.name === "DefineInstrumentAmount") {
				// Loop through all entities from processed sentence
				for (let j = 0; j < sent.entities.length; j++) {
					const entity = sent.entities[j]; // Fetch entity

					// Check if ORG or PERSON is contained within the entity
					if (entity.entity === "MONEY" || entity.entity === "ORDINAL") {
						// Add entity to digest
						digest.instrumentAmount = this.addToDigest(
							digest.instrumentAmount,
              "instrumentAmount",
							entity,
							sent.index
						);
					}
				}
			}
		}

		return digest;
	};

	/**
	 * Adds or updates entity in a sub digest array
	 * @param subDigest sub digest such as issuerName, agent, etc
	 * @param entity entity that should be added to digest
	 * @param index index of sentence
	 */
	private addToDigest = (
		_subDigest: IDigestField[],
		_subDigestName: string,
		entity: IEntity,
		index: number,
	): IDigestField[] => {
		const subDigest: IDigestField[] = _subDigest;
		let issuerNameIndex = -1;
    const entityCopy = { ...entity };

    const useSimCheck: boolean = ["issuerName", "issuerIncorporationPlace", "agent"].includes(_subDigestName);
    const checkForCompanyType: boolean = ["issuerName", "agent"].includes(_subDigestName);

    if (checkForCompanyType) {
      //assuming space between company name and type
      const sEntityVal = entityCopy.value.split(/[ \n\t]/);
      const companyTypeIndex = sEntityVal.findIndex((val) => possibleCompanyTypes.includes(val.replace("'s", "")));
      if (companyTypeIndex > 0) {
        // moving company type postfix from entity name to entity company_type_string
        entityCopy.value = sEntityVal.slice(0, companyTypeIndex).join(" ");
        entityCopy.company_type_string = sEntityVal[companyTypeIndex].replace("'s", "");
      }
    }

    // removing all suggested denominations that doesn't include one of the predefined currencies.
    // [heuristic] - requiring denominations to be divisible by 10, otherwise just using currency
    if (_subDigestName === "denomination") {
      entityCopy.company_type_string = entity.value.toUpperCase().split(/[ \n\t]/).find((sVal) => possibleCurrencies.includes(sVal));
      entityCopy.value = " -";

      // if no currency found, defaulting to an existing currency.
      if (entityCopy.company_type_string == null) {
        for (let k = 0; k < subDigest.length; k++) {
          if (subDigest[k].type_string != null) {
            entityCopy.company_type_string = subDigest[k].type_string;
            break;
          }
        }
      }

      const numbers = (entity.value.match(/[+-]?\d+(\.\d+)?/g) || []).map((v) => parseFloat(v));
      for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i];
        if (number && (number % 10 === 0 || [1, 0.1, 0.01].includes(number))) {
          entityCopy.value = `${number}`;
          console.log(entityCopy.value, "is an acceptable number value");
          break;
        }
      }
    }

		// Loop through all digest data
		for (let k = 0; k < subDigest.length; k++) {
			// Check if entity exist already exist in issuer name
			if (useSimCheck) {
        if (stringSimilarity.compareTwoStrings(subDigest[k].name, entityCopy.value) > 0.9) {
          issuerNameIndex = k;
          break;
        }
      } else if (subDigest[k].name === entityCopy.value) {
        issuerNameIndex = k;
        break;
      } else if (subDigest[k].name === " -") {
        subDigest[k].name = entityCopy.value;
        issuerNameIndex = k;
        break;
      }
		}

		// If entity not in issuer name, add instance
		if (issuerNameIndex === -1) {
			// Push digest data
			subDigest.push({
				name: entityCopy.value,
				type: entityCopy.entity,
      	type_string: entityCopy.company_type_string,
				count: 0,
				sentence_indexes: [],
        matching_entity_names: []
			});
			issuerNameIndex = subDigest.length - 1; // Update index
		}

		// Update entity count in issuer name
		// eslint-disable-next-line no-param-reassign
		subDigest[issuerNameIndex].count += 1;
		subDigest[issuerNameIndex].sentence_indexes.push(index);
    // Setting company type string if not already set
    if (checkForCompanyType && !subDigest[issuerNameIndex].type_string) {
      subDigest[issuerNameIndex].type_string = entityCopy.company_type_string;
    }
    subDigest[issuerNameIndex].matching_entity_names.push(entityCopy.value);

		return subDigest; // Return updated sub digest
	};
}

const nlpService = new NLPService();
export default nlpService;
