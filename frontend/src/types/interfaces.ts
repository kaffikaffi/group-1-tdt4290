export interface IEntity {
	entity: string;
	value: string;
	company_type_string?: string;
	start: number;
	end: number;
}

export interface IDigestField {
	name: string;
	type_string?: string;
	type: string;
	count: number;
	sentence_indexes: number[];
  matching_entity_names: string[]
}

export interface IDigest {
	issuerName: IDigestField[];
	issuerIncorporationPlace: IDigestField[];
	denomination: IDigestField[];
	agent: IDigestField[];
	instrumentAmount: IDigestField[];
	instrumentMaturityDate: IDigestField[];
}

export interface IDigestData {
	issuerName: IDigestField;
	issuerIncorporationPlace: IDigestField;
	denomination: IDigestField;
	agent: IDigestField;
	instrumentAmount: IDigestField;
	instrumentMaturityDate: IDigestField;
}

export interface IProcessedSentence {
	index: number;
	text: string;
	classification: {
		id: number;
		name: string;
		confidence: number;
	};
	entities: IEntity[];
	progressionTag: string;
}

export interface IProcessedData {
	digest: IDigest | undefined;
	processed_sentences: IProcessedSentence[];
	latest_c_index: number;
	latest_t_index: number;
}

export interface ICorrectedData {
	digest: IDigestData;
	processed_sentences: IProcessedSentence[];
}

export interface IUtterance {
	id: number;
	confidence: number;
	text: string;
	intent: string;
	entities: IEntity[];
}

export interface IState {
	username: string;
	password: string;
	isLoggedIn: boolean;
	processedData: IProcessedData | undefined;
	correctedData: ICorrectedData;
}

export interface IUtterancesFilter {
	irrelevant: boolean;
	zeroEntities: boolean;
}

export interface IClassificationMeta {
	defaultColor: string;
	nameSimplification: string;
}

export interface ITest {
	message: string;
}
