import { FC } from "react";
import Title from "../components/Title";

import "../scss/pages/About.scss";

const About: FC = (): JSX.Element => {
	return (
		<div className="about">
			<Title title="About" />
			<p>
				This product is created by group 1 in the course TDT4290 Customer Driven
				Project for mTerms AS. The team was divided into two subteams, called
				Frontend and Backend.
			</p>
		</div>
	);
};

export default About;
