export interface IProcessedSentence {
	index: number;
	text: string;
	classification: {
		id: number;
		name: string;
		confidence: number;
	};
	entities: any[];
	progressionTag: string;
}

export interface IProcessedTextPayload {
  processed_sentences?: IProcessedSentence[]
}