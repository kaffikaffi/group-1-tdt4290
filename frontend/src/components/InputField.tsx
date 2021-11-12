import { FC } from "react";

import "../scss/components/InputField.scss";

interface IInputFieldProps {
	variable: string;
	value: string;
	index?: number;
	style?: React.CSSProperties;
	name?: string;
	id?: string;
	setValue: (value: string, index: number) => void;
}

const InputField: FC<IInputFieldProps> = ({
	variable,
	value,
	index = 0,
	style,
	name,
	id = "input",
	setValue,
}): JSX.Element => (
	<div className="inputfield">
		<div className="inputfield-label">{variable}</div>
		<input
			id={id}
			className="inputfield-input"
			style={style}
			type="text"
			value={value}
			onChange={(e) => setValue(e.target.value, index)}
		/>
	</div>
);

InputField.defaultProps = {
	index: 0,
	name: "undefined",
	id: "input",
	style: undefined,
};

export default InputField;
