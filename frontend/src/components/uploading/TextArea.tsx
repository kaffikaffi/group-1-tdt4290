import { FC } from "react";

import "../../scss/components/uploading/TextArea.scss";

export interface ITextAreaProps {
	text: string;
	setText: React.Dispatch<React.SetStateAction<string>>;
}

const TextArea: FC<ITextAreaProps> = ({ text, setText }): JSX.Element => {
	return (
		<div className="textarea">
			<div className="title">Processing Data</div>
			<div className="info">Insert the text you want processed...</div>
			<textarea
				rows={4}
				cols={50}
				value={text}
				onChange={(e) => setText(e.target.value)}
				id="textarea"
			/>
		</div>
	);
};

export default TextArea;
