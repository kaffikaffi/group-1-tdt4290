/* eslint-disable react/jsx-curly-newline */
import { FC, useState } from "react";
import { Switch, FormGroup, FormControlLabel } from "@material-ui/core";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";

import {
	IProcessedSentence,
	IState,
	IUtterancesFilter,
} from "../../types/interfaces";
import { setCorrectedData, setProcessedData } from "../../features/state";
import { initialFilter, initialModalStyles } from "../../misc/initialData";
import UtteranceInterface from "./UtteranceInterface";
import UtteranceFilters from "./UtteranceFilters";
import Utterance from "./Utterance";

import "../../scss/components/utterances/Utterances.scss";

const Utterances: FC = (): JSX.Element => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [filter, setFilter] = useState<IUtterancesFilter>(initialFilter);
	const [sortBy, setSortBy] = useState<string>("confidence");

	const [activeUtterance, setActiveUtterance] = useState<
		IProcessedSentence | undefined
	>();
	const state: IState = useSelector(
		(state: RootStateOrAny) => state.state.value
	);
	const dispatch = useDispatch();

	/**
	 * Sets active utterance, and auto scrolls to utterance interface
	 * @param _utterance utterance that should be activated
	 */
	const setUtterance = (_utterance: IProcessedSentence): void => {
		setActiveUtterance(_utterance); // Sets active utterance state
		setIsModalOpen(true); // Open model
	};

	/**
	 * Removes a specified utterance from state
	 * @param _utterance utterance to be removed from state
	 */
	const removeUtterance = (_utterance: IProcessedSentence): void => {
		// Update corrected data state with new array
    const processed_sents : IProcessedSentence[] = state.correctedData
      ? [...state.correctedData.processed_sentences, _utterance]
      : [_utterance];

		dispatch(
			setCorrectedData({
        ...state.correctedData,
        processed_sentences: processed_sents,
			})
		);

		// Check if processed data has been set
		if (state.processedData) {
			// Update state with filtered array of sentences
			dispatch(
				setProcessedData({
          ...state.processedData,
          processed_sentences: [...state.processedData.processed_sentences.filter(
            (utterance) => utterance.index !== _utterance.index
          )]
        })
			);
		}

		// Reset active utterance to undefined
		setActiveUtterance(undefined);
	};

	/**
	 * Filters utterances based on filter state
	 * @returns filtered array of utterances
	 */
	const filterUtterances = (): ((
		sentence: IProcessedSentence,
		key: number
	) => boolean) => {
		return (sentence: IProcessedSentence, key: number) => {
			if (filter.irrelevant && filter.zeroEntities) {
				return (
					sentence.classification.name !== "Irrelevant" &&
					sentence.entities.length > 0
				);
			}
			if (filter.irrelevant && !filter.zeroEntities) {
				return sentence.classification.name !== "Irrelevant";
			}
			if (!filter.irrelevant && filter.zeroEntities) {
				return sentence.entities.length > 0;
			}
			return true;
		};
	};

	/**
	 * Sorts utterances based on chosen
	 * @returns sorted array of utterances
	 */
	const sortUtterances = (): ((
		a: IProcessedSentence,
		b: IProcessedSentence
	) => number) => {
		switch (sortBy) {
			case "confidence":
				return (a: IProcessedSentence, b: IProcessedSentence) => {
					return a.classification.confidence - b.classification.confidence;
				};
			case "classification":
				return (a: IProcessedSentence, b: IProcessedSentence) => {
					return a.classification.name < b.classification.name ? -1 : 1;
				};
			default:
				return (a: IProcessedSentence, b: IProcessedSentence) => {
					return a.index - b.index; // chronologially, like in the original document
				};
		}
	};

	return (
		<>
			<FormGroup>
				<FormControlLabel
					control={
						<Switch
							checked={showOptions}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setShowOptions(event.target.checked);
							}}
							inputProps={{ "aria-label": "controlled" }}
						/>
					}
					label="Show options"
					style={{ marginBottom: "15px" }}
				/>
			</FormGroup>
			{showOptions && (
				<UtteranceFilters
					filter={filter}
					setFilter={setFilter}
					sortBy={sortBy}
					setSortBy={setSortBy}
				/>
			)}
			<div className="utterances" id="utterances">
				<div className="utterances-header">
					<div className="utterances-header-confidence">Classification</div>
					<div className="utterances-header-utterance">Utterance</div>
					<div className="utterances-header-entityCount">Entities</div>
				</div>
				<div className="content">
					{state.processedData?.processed_sentences
						.filter(filterUtterances())
						.sort(sortUtterances())
						.map((utterance: IProcessedSentence, key: number) => (
							<Utterance
								utterance={utterance}
								setActiveUtterance={() => setUtterance(utterance)}
								key={key}
							/>
						))}
				</div>
			</div>

			{activeUtterance && (
				<Modal
					id="utterences-modal"
					isOpen={isModalOpen}
					onRequestClose={() => setIsModalOpen(false)}
					ariaHideApp={false}
					style={initialModalStyles}
					contentLabel="Utterance Interface"
				>
					<UtteranceInterface
						utterance={activeUtterance}
						removeUtterance={removeUtterance}
					/>
				</Modal>
			)}
		</>
	);
};

export default Utterances;
