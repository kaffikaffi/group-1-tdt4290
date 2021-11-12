import { FC } from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";

import "../scss/pages/Home.scss";

const Home: FC = (): JSX.Element => {
	const history = useHistory();
	return (
		<div className="home">
			<div className="home-banner">
				<h1 className="home-banner-logo">mTerms</h1>
				<h4 className="home-informationtext">
					This is a tool where you can pass a block of text and our tool will
					use NLP (Natural Language Processing) to understand and process the
					intent for the text. Click the button below to start processing data.
				</h4>
				<Button
					id="button-home"
					name="Process Data"
					onClick={() => history.push("/processing")}
				/>
			</div>
		</div>
	);
};

export default Home;
