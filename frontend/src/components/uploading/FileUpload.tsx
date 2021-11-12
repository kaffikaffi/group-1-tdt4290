import { FC, useRef } from "react";
import DescriptionIcon from "@material-ui/icons/Description";
import Button from "../Button";

import "../../scss/components/uploading/FileUpload.scss";

export interface IFileUploadProps {
	file: any;
	setFile: React.Dispatch<React.SetStateAction<any>>;
}

const FileUpload: FC<IFileUploadProps> = ({ file, setFile }): JSX.Element => {
	const fileRef = useRef<any>(null);
	const linkRef = useRef<any>(null);
	let objectURL: any;

	/**
	 * Handles upload of file, by clicking ref to file input
	 */
	const handleFileUpload = (): void => {
		if (fileRef.current) fileRef.current.click();
	};

	/**
	 * Sets uploaded file to state
	 * @param event Input event for fetching selected file
	 */
	const handleUploadedFile = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		if (event.target.files) setFile(event.target.files[0]);
	};

	/**
	 * Takes in file and downloads it
	 * @param file Takes in file
	 */
	const downloadFile = (file: any): void => {
		// Check if object url needs to be reset/revoked
		if (objectURL) {
			URL.revokeObjectURL(objectURL); // Revoke old object url to avoid using unneeded memory
		}

		objectURL = URL.createObjectURL(file); // Create new object url for file
		if (linkRef.current) {
			linkRef.current.download = file.name; // Fetch file name
			linkRef.current.href = objectURL; // Fetch href from object url
			linkRef.current.click(); // Click hidden link with generated download link
		}
	};

	return (
		<div className="fileupload">
			<div className="title">Prosessing Data</div>
			<div className="info">Upload a pdf file to run processing...</div>
			<div className="file">
				<DescriptionIcon className="file-image" />
				<div className="file-name" id="file-name">
					{file?.name ? file.name : "No file chosen..."}
				</div>
			</div>
			<input
				type="file"
				ref={fileRef}
				style={{ display: "none" }}
				onChange={(e) => handleUploadedFile(e)}
				id="file-upload"
			/>
			<a href="." ref={linkRef} download style={{ display: "none" }}>
				Link
			</a>
			<div className="buttons">
				<Button name="Upload file" onClick={handleFileUpload} />
				{file && (
					<Button name="Download file" onClick={() => downloadFile(file)} />
				)}
			</div>
		</div>
	);
};

export default FileUpload;
