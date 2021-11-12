import { FC } from "react";

import "../scss/components/Title.scss";

export interface ITitleProps {
	title: string;
}

const Title: FC<ITitleProps> = ({ title }): JSX.Element => (
	<div className="title">{title}</div>
);

export default Title;
