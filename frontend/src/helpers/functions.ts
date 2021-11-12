import { IClassificationMeta } from "../types/interfaces";

const confidenceColors: string[] = [
	"#ff1a00", // Red
	"#ff5900",
	"#ff8400",
	"#ffa303",
	"#ffcc01", // Yellow
	"#ffe600",
	"#f7ff02",
	"#c8ff15",
	"#52ff02", // Green
];

/**
 * Color picker for utterance confidence
 * @param confidence percantage of confidence (0% - 100%)
 * @returns Returns color hex for given confidence
 */
export const getConfidenceColor = (confidence: number): string => {
	// Check which color index should be used
	const colorIndexPercentage: number = 100 / confidenceColors.length;

	// Loop through color array
	for (let i = 0; i < confidenceColors.length; i++) {
		// Check if confidence is below the color index percentage
		if (confidence <= colorIndexPercentage * (i + 1)) {
			// Return color from current index
			return confidenceColors[i];
		}
	}

	// Return default value if failed
	return "#ffffff";
};

/**
 * Async function that waits until given time has been reached
 * @param ms miliseconds that function should wait
 * @returns returns void promise
 */
export const wait = (ms: number): Promise<Promise<void>> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Scrolls view to an HTML element with offset
 * @param elemntId HTML id of element
 * @param offset offset from the element
 */
export const scrollToElementId = (elementId: string, offset: number): void => {
	const element: HTMLElement | null = document.getElementById(elementId); // Get element from id

	// Check if element was fetched successfully
	if (element) {
		const elementPosition: number =
			element.getBoundingClientRect().top + document.body.scrollTop; // Get element pos
		const offsetPosition: number = elementPosition - offset; // Add offset to pos
		document.body.scrollTo({ top: offsetPosition, behavior: "smooth" }); // Scroll to offset pos
	} else {
		console.log("[scrollToElementId] elementId was not found..."); // Log invalid element id
	}
};

/**
 * Rounds number to given decimal
 * @param num number that should be rounded
 * @param places the amount of decimals that should be used
 * @returns rounded number
 */
export const roundToDecimalPlaces = (num: number, places: number): number => {
	if (num) return +num.toFixed(places);
	return 0;
};

/**
 * Copies object without reference
 * @param obj object to copy
 * @returns returns copy of object without reference
 */
export const copyObjectWithoutReference = (obj: any): any => {
	return JSON.parse(JSON.stringify(obj));
};

export const getClassificationMeta = (
	classificationId: string
): IClassificationMeta => {
	switch (classificationId) {
		case "DefineIssuerInfo":
			return {
				defaultColor: "#3F51B5",
				nameSimplification: "IssuerInfo",
			};
		case "DefineInstrumentMaturityDate":
			return {
				defaultColor: "#689F38",
				nameSimplification: "MaturityDate",
			};
		case "DefineDenomination":
			return {
				defaultColor: "#311B92",
				nameSimplification: "Denomination",
			};
		case "DefineInstrumentAmount":
			return {
				defaultColor: "#FDD835",
				nameSimplification: "Amount",
			};
		case "DefineAgent":
			return {
				defaultColor: "#eb4034",
				nameSimplification: "Agent",
			};
		case "Irrelevant":
			return {
				defaultColor: "#E53935",
				nameSimplification: "Irrelevant",
			};
		default:
			return {
				defaultColor: "",
				nameSimplification: "UNKNOWN",
			};
	}
};
