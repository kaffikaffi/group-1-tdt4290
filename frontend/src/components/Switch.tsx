import { FC } from "react";

import "../scss/components/Switch.scss";

interface ISwitchProps {
	isOption1: boolean;
	setIsOption1: React.Dispatch<React.SetStateAction<boolean>>;
	option1: string;
	option2: string;
}

const Switch: FC<ISwitchProps> = ({
	isOption1,
	setIsOption1,
	option1,
	option2,
}): JSX.Element => {
	const handleToggle = (): void => {
		setIsOption1(!isOption1);
	};

	return (
		<div className="switch" onClick={handleToggle} id="switch">
			{isOption1 ? (
				<>
					<div className="switch-option1">{option1}</div>
					<div className="switch-option1-option2">{option2}</div>
				</>
			) : (
				<>
					<div className="switch-option2">{option1}</div>
					<div className="switch-option2-option1">{option2}</div>
				</>
			)}
		</div>
	);
};

export default Switch;
