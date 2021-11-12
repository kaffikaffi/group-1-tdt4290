import { IDigestData, IUtterancesFilter } from "../types/interfaces";

export const initialModalStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		width: "80vw",
		maxWidth: "850px",
		height: "80vh",
		backgroundColor: "transparent",
	},
};

export const initialFilter: IUtterancesFilter = {
	irrelevant: false,
	zeroEntities: false,
};

export const initialDigestState: IDigestData = {
	issuerName: {
		name: "",
		type: "",
		count: 0,
		sentence_indexes: [],
    matching_entity_names: []
	},
	issuerIncorporationPlace: {
		name: "",
		type: "",
		count: 0,
		sentence_indexes: [],
    matching_entity_names: []
	},
	agent: {
		name: "",
		type: "",
		count: 0,
		sentence_indexes: [],
    matching_entity_names: []
	},
	denomination: {
		name: "",
		type: "",
		count: 0,
		sentence_indexes: [],
    matching_entity_names: []
	},
	instrumentMaturityDate: {
		name: "",
		type: "",
		count: 0,
		sentence_indexes: [],
    matching_entity_names: []
	},
	instrumentAmount: {
		name: "",
		type: "",
		count: 0,
		sentence_indexes: [],
    matching_entity_names: []
	},
};
