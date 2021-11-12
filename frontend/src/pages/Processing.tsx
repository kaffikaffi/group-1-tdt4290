import { FC, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { IState } from "../types/interfaces";
import { setCorrectedData } from "../features/state";
import Auth from "../components/Auth";
import Title from "../components/Title";
import Anchor from "../components/Anchor";
import Button from "../components/Button";
import Digest from "../components/digest/Digest";
import Upload from "../components/uploading/Upload";
import useLoginDetails from "../hooks/useLoginDetails";
import useFilterSentences from "../hooks/useFilterSentences";
import Utterances from "../components/utterances/Utterances";

import "../scss/pages/Processing.scss";

const Processing: FC = (): JSX.Element => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showDigest, setShowDigest] = useState<boolean>(false);
	const state: IState = useSelector(
		(state: RootStateOrAny) => state.state.value
	);
	const dispatch = useDispatch();
	useLoginDetails();
	useFilterSentences();

	/**
	 * Handles submission of corrected data
	 * Sends data to backend as training data
	 */
	const handleSubmit = async (): Promise<void> => {
		setIsLoading(true); // Start loading animation

		// Submit training data to database
		await axios.post("/api/saveText", {
			processed_sentences: state.correctedData.processed_sentences.filter(
				(sent) => sent.classification.name !== "Undefined"
			),
		});

		// Remove corrected data from state
		dispatch(
			setCorrectedData({ ...state.correctedData, processed_sentences: [] })
		);

		setIsLoading(false); // End loading animation
	};

	return (
		<div className="processing" id="home">
			<div className="processing-content">
				{!state.isLoggedIn ? (
					<Auth />
				) : (
					<>
						{/* Component for uploading and submitting text */}
						<Upload />
						{/* Render utterances when they have been fetched from backend */}
						{state.processedData?.processed_sentences &&
							state.processedData?.processed_sentences.length > 0 && (
								<>
									<Anchor id="utterances" style={{ marginBottom: "50px" }} />
									<Title title="Utterances" />
									{!showDigest ? (
										<button
											className="processing-content-button"
											type="button"
											onClick={() => setShowDigest(true)}
										>
											Show Digest Data
										</button>
									) : (
										<button
											className="processing-content-button"
											type="button"
											onClick={() => setShowDigest(false)}
										>
											Hide Digest Data
										</button>
									)}

									{/* Display Digest data from processed data */}
									{state.processedData?.processed_sentences &&
										state.processedData?.digest && (
											<>
												{showDigest && (
													<Digest digest={state.processedData.digest} />
												)}
											</>
										)}

									<div className="info">
										Click the utterance you want to see the results for and
										correct...
									</div>
									<Utterances />
								</>
							)}

						{state.correctedData.processed_sentences.length > 0 && (
							<Button
								name="Submit"
								isLoading={isLoading}
								onClick={handleSubmit}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Processing;
