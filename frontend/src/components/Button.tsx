import { FC } from "react";
import Loader from "./Loader";

import "../scss/components/Button.scss";

export interface IButtonProps {
	id?: string;
	isLoading?: boolean;
	name: string;
	onClick: () => void;
}

const Button: FC<IButtonProps> = ({
	name,
	isLoading,
	id,
	onClick,
}): JSX.Element => {
	return (
		<button id={id} type="button" className="button" onClick={onClick}>
			{!isLoading ? (
				name
			) : (
				<Loader isLoading={isLoading} color="#FFFFFF" size={8} />
			)}
		</button>
	);
};

export default Button;
