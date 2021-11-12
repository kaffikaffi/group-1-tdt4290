import { FC } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import "../scss/components/Loader.scss";

interface ILoader {
	isLoading: boolean;
	color: string;
	size: number;
}

const Loader: FC<ILoader> = ({ isLoading, color, size }): JSX.Element => (
	<div className="loader">
		<BeatLoader
			color={color}
			loading={isLoading}
			speedMultiplier={0.7}
			size={size}
		/>
	</div>
);

export default Loader;
