/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import { FC, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { IProcessedData, IState } from "../../types/interfaces";
import {
	copyObjectWithoutReference,
	scrollToElementId,
} from "../../helpers/functions";
import { setProcessedData } from "../../features/state";
import FileUpload from "./FileUpload";
import TextArea from "./TextArea";
import Button from "../Button";
import nlpService from "../../helpers/nlpService";

import "../../scss/components/uploading/Upload.scss";

const Upload: FC = (): JSX.Element => {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [isTextArea, setIsTextArea] = useState<boolean>(true);
	const [progress, setProgress] = useState<number>(0);
	const [text, setText] = useState<string>("");
	const [file, setFile] = useState<any>();
	const textSnippetLimit = 500;
	const state: IState = useSelector(
		(state: RootStateOrAny) => state.state.value
	);
	const dispatch = useDispatch();

	/**
	 * Makes API request for processing sentences
	 * @param currentSnippet currently active snippet sent in nlp request
	 * @param processData object used for storing response data
	 */
	const processSentences = async (
		currentSnippet: string,
		processedData: IProcessedData
	): Promise<IProcessedData> => {
		const data: IProcessedData | undefined = await nlpService.processText(
			currentSnippet,
			text.length,
			processedData.latest_t_index,
			processedData.latest_c_index,
			state.username,
			state.password
		);

		// Check if request was successfull
		if (data) {
			return {
				digest: processedData.digest,
				processed_sentences: processedData.processed_sentences.concat(
					data.processed_sentences
				),
				latest_t_index: data.latest_t_index,
				latest_c_index: data.latest_c_index,
			};
		}
		return processedData;
	};

	/**
	 * Processes text input, and updates state with utterances response
	 * @return vois promise
	 */
	const handleTextProcessing = async (fullText: boolean): Promise<void> => {
		setIsProcessing(true); // Set processing animation

		// Instatiate processed data object for updating for each request
		let processedData: IProcessedData = {
			digest: undefined,
			processed_sentences: [],
			latest_c_index: 0,
			latest_t_index: 0,
		};

		// Check if full or sliced text should be processed
		if (!fullText) {
			const textSnippets = text.split("\n\n"); // Split text in snippets on line breakes
			let currentSnippet = ""; // Variable for building up appropriate text snippet length
			let charCount = 0; // Char counter for updating progress state

			// Loop through all text slices
			for (let i = 0; i < textSnippets.length; i++) {
				currentSnippet += `${textSnippets[i]}\n\n`; // Add snippet to current snippet

				// Check if requested snippet length has been reach. Make API request if length was reached
				if (currentSnippet.length > textSnippetLimit) {
					processedData = await processSentences(currentSnippet, processedData); // Process
					charCount += currentSnippet.length; // Add length of current snippet to char count
					setProgress(Math.ceil((charCount * 100) / text.length)); // Update progress state
					currentSnippet = ""; // Reset current snippet

					// Generate digest data from processed sentences
					processedData.digest = nlpService.processDigest(
						processedData.processed_sentences
					);

					dispatch(setProcessedData(processedData)); // Update processed data
				}
			}

			// Send last snippet if current snippet still holds a value
			if (currentSnippet.length > 0) {
				processedData = await processSentences(currentSnippet, processedData); // Process sentences
				charCount += currentSnippet.length; // Add length of current snippet to char count
				setProgress(100); // Set progress to 100%
				currentSnippet = ""; // Reset current snippet
			}
		} else {
			await processSentences(text, processedData); // Process full text in one request
		}

		// Check if processed data was fetched successfully
		if (processedData?.processed_sentences) {
			// Generate digest data from processed sentences
			processedData = {
				...processedData,
				digest: nlpService.processDigest(processedData.processed_sentences),
			};

			dispatch(setProcessedData(processedData)); // Store processed data
			scrollToElementId("utterances", 0); // Scroll to utterances
			setProgress(0); // Reset progress
		}

		setIsProcessing(false); // Stop processing animation
	};

	/**
	 * Processes file input, and updates state with utterances response
	 * @returns void promise
	 */
	const handleFileProcessing = async (): Promise<void> => {
		// eslint-disable-next-line no-alert
		alert("This functionality is currently not available...");
	};

	return (
		<div className="upload" id="upload">
			{isTextArea ? (
				<TextArea text={text} setText={setText} />
			) : (
				<FileUpload file={file} setFile={setFile} />
			)}
			{/* <Switch
				isOption1={isTextArea}
				setIsOption1={setIsTextArea}
				option1="Text"
				option2="File"
			/> */}
			{isTextArea
				? text && (
						<Button
							id="btn-processing-text"
							onClick={() => handleTextProcessing(false)}
							name="Process Data"
							isLoading={isProcessing}
						/>
				  )
				: file && (
						<Button
							id="btn-processing-file"
							onClick={handleFileProcessing}
							name="Process Data"
							isLoading={isProcessing}
						/>
				  )}

			{isProcessing && (
				<div className="upload-progress">
					<ProgressBar now={progress} className="upload-progress-bar" />
				</div>
			)}
		</div>
	);
};

export default Upload;
