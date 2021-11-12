/* eslint-disable react/jsx-curly-newline */
import { FC } from "react";
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from "@material-ui/core";

import { IUtterancesFilter } from "../../types/interfaces";

import "../../scss/components/utterances/UtteranceFilters.scss";

interface IUtteranceFiltersProps {
	filter: IUtterancesFilter;
	sortBy: string;
	setFilter: React.Dispatch<React.SetStateAction<IUtterancesFilter>>;
	setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

const UtteranceFilters: FC<IUtteranceFiltersProps> = ({
	filter,
	sortBy,
	setFilter,
	setSortBy,
}): JSX.Element => {
	const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSortBy((event.target as HTMLInputElement).value);
	};

	return (
		<>
			<div className="utteranceFilters">
				<button
					type="button"
					onClick={() =>
						setFilter({ ...filter, irrelevant: !filter.irrelevant })
					}
					style={{
						color: !filter.irrelevant ? "#1e2330" : "white",
						background: !filter.irrelevant ? "white" : "#1e2330",
					}}
				>
					Irrelevant
				</button>
				<button
					type="button"
					onClick={() =>
						setFilter({ ...filter, zeroEntities: !filter.zeroEntities })
					}
					style={{
						color: !filter.zeroEntities ? "#1e2330" : "white",
						background: !filter.zeroEntities ? "white" : "#1e2330",
					}}
				>
					Zero Entities
				</button>
			</div>
			<FormControl
				component="fieldset"
				style={{
					display: "inline-block",
					textAlign: "center",
					marginBottom: "15px",
				}}
			>
				<FormLabel
					component="span"
					style={{ color: "white", alignSelf: "center" }}
				>
					Sort By:
				</FormLabel>
				<RadioGroup
					row
					aria-label="Sort By"
					name="controlled-radio-buttons-group"
					value={sortBy}
					onChange={handleSortByChange}
				>
					<FormControlLabel
						value="confidence"
						control={<Radio />}
						label="Confidence"
					/>
					<FormControlLabel
						value="classification"
						control={<Radio />}
						label="Classification"
					/>
					<FormControlLabel
						value="index"
						control={<Radio />}
						label="Sentence Index"
					/>
				</RadioGroup>
			</FormControl>
		</>
	);
};

export default UtteranceFilters;
