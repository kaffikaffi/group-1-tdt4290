import { FC } from "react";

import { IDigestField } from "../../types/interfaces";

import "../../scss/components/digest/DigestSelect.scss";

interface IDigestSelectProps {
	title: string;
	value: string;
	digestFields: IDigestField[];
	onChange: (value: string) => void;
}

const DigestSelect: FC<IDigestSelectProps> = ({
	title,
	value,
	digestFields,
	onChange,
}): JSX.Element => {
	return (
		<div className="digestSelect">
			<h3>{title}</h3>
			<select
				disabled={digestFields.length === 0 && true}
				onChange={(e) => onChange(e.target.value)}
				value={value}
			>
				<option value=""> </option>
				{digestFields.map((field: IDigestField, key: number) => (
					<option key={key} value={field.name}>
						{`${field.name} ${field.type_string || ""}`}
					</option>
				))}
			</select>
		</div>
	);
};

export default DigestSelect;
