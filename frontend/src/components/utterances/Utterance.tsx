import { FC } from "react";

import {
	getClassificationMeta,
	getConfidenceColor,
	roundToDecimalPlaces,
} from "../../helpers/functions";
import { IProcessedSentence } from "../../types/interfaces";

import "../../scss/components/utterances/Utterance.scss";

interface IUtteranceProps {
	utterance: IProcessedSentence;
	setActiveUtterance: (
		value: React.SetStateAction<IProcessedSentence | undefined>
	) => void;
}

const Utterance: FC<IUtteranceProps> = ({
	utterance,
	setActiveUtterance,
}): JSX.Element => (
	<div
		className="utterance"
		onClick={() => setActiveUtterance(utterance)}
		style={{
			backgroundColor: `${getConfidenceColor(
				utterance.classification.confidence * 100
			)}66`,
		}}
	>
		<div className="utterance-classification">
			<div
				className="utterance-classification-text"
				style={{
					backgroundColor: getClassificationMeta(utterance.classification.name)
						.defaultColor,
				}}
			>
				{`${
					getClassificationMeta(utterance.classification.name)
						.nameSimplification
				}`}
			</div>
			<div className="utterance-confidence">
				{`${roundToDecimalPlaces(
					utterance.classification.confidence * 100,
					0
				)} %`}
			</div>
		</div>
		<div className="utterance-text">{utterance.text}</div>
		<div className="utterance-entityCount">{utterance.entities.length}</div>
	</div>
);

export default Utterance;
