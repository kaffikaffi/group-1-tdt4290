import { useEffect } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { setProcessedData } from "../features/state";
import { copyObjectWithoutReference } from "../helpers/functions";

import { IProcessedSentence, IState } from "../types/interfaces";

const useFilterSentences = (): void => {
	const state: IState = useSelector(
		(state: RootStateOrAny) => state.state.value
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (state.processedData) {
			const processedData = copyObjectWithoutReference(state.processedData);
			let updateProcessedSentences = false;

			// Loop through all sentences in corrected data
			for (let i = 0; i < state.correctedData.processed_sentences.length; i++) {
				const correctedSentence = state.correctedData.processed_sentences[i];

				// Loop through all sentences in processed data
				for (
					let j = 0;
					j < state.processedData.processed_sentences.length;
					j++
				) {
					const processedSentence = state.processedData.processed_sentences[j];

					// Check if any duplicates is present
					if (processedSentence.index === correctedSentence.index) {
						// Set boolean for making sure that the state will be updated
						updateProcessedSentences = true;

						// Filter out the duplicate from processed sentences
						processedData.processed_sentences = [
							...processedData.processed_sentences.filter(
								(utterance: IProcessedSentence) =>
									utterance.index !== correctedSentence.index
							),
						];
					}
				}
			}

			// If duplicate was found, update state
			if (updateProcessedSentences) {
				dispatch(setProcessedData(processedData));
			}
		}
	}, [state.processedData?.processed_sentences]);
};

export default useFilterSentences;
