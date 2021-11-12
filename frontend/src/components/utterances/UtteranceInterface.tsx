import { FC, useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";

import { setCorrectedData } from "../../features/state";
import { copyObjectWithoutReference } from "../../helpers/functions";
import { IEntity, IProcessedSentence, IState } from "../../types/interfaces";
import Button from "../Button";
import EntitiesInterface from "./EntitiesInterface";

import "../../scss/components/utterances/UtteranceInterface.scss";

interface IUtteranceInterfaceProps {
	utterance: IProcessedSentence;
	removeUtterance: (utterance: IProcessedSentence) => void;
}

const intents = [
	"Undefined",
	"DefineIssuerInfo",
	"DefineInstrumentMaturityDate",
	"DefineDenomination",
	"DefineInstrumentAmount",
	"DefineAgent",
	"Irrelevant",
];

export const UtteranceInterface: FC<IUtteranceInterfaceProps> = ({
	utterance,
	removeUtterance,
}): JSX.Element => {
	const [modifiedUtterance, setModifiedUtterance] =
		useState<IProcessedSentence>(utterance);
	const state: IState = useSelector(
		(state: RootStateOrAny) => state.state.value
	);
	const dispatch = useDispatch();

	/**
	 * Copies utterance value to local modifiedUtterance and auto-scrolls to interface
	 */
	useEffect(() => {
		setModifiedUtterance(utterance); // Set local utterance
	}, [utterance]);

	/**
	 * Updates intent of local utterance
	 * @param value value of updated intent
	 */
	const setIntent = (value: string): void => {
		// Update intent of utterance
		setModifiedUtterance({
			...modifiedUtterance,
			classification: { ...modifiedUtterance.classification, name: value },
		});
	};

	/**
	 * Updates entities of local utterance instance
	 * @param entities array of updated entities
	 */
	const setEntities = (entities: IEntity[]): void => {
		setModifiedUtterance({ ...modifiedUtterance, entities }); // Update entities of local utterance
	};

	/**
	 * Handles save button click. Removes utterance from state
	 */
	const handleSave = (): void => {
		// Make copy of processed sentences in corrected data
		const processed_sentences = copyObjectWithoutReference(
			state.correctedData.processed_sentences
		);

		// Push modified utterance
		processed_sentences.push(modifiedUtterance);

		// Update processed sentences in corrected data
		dispatch(setCorrectedData({ ...state.correctedData, processed_sentences }));

		// Remove utterance from state
		removeUtterance(modifiedUtterance);
	};

	return (
		<div className="utteranceInterface">
			<div className="utteranceInterface-utterance">{utterance.text}</div>
			<h6>Correct your intent or entites and click 'save' when you are done</h6>
			<div className="utteranceInterface-intent">
				<h3>Intent</h3>
				<select
					defaultValue={utterance.classification.name}
					onChange={(e) => setIntent(e.target.value)}
				>
					{intents.map((intent, key) => (
						<option key={key} value={intent}>
							{intent}
						</option>
					))}
				</select>
			</div>
			<div className="utteranceInterface-inputs">
				<div className="utteranceInterface-inputs-label">Entities</div>
				<EntitiesInterface
					entities={utterance.entities}
					setEntities={setEntities}
				/>
			</div>
			<Button name="Save" onClick={handleSave} />
		</div>
	);
};

export default UtteranceInterface;
