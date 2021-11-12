// eslint-disable-next-line import/no-unresolved
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient, ItemResponse } from "@azure/cosmos";

import { IProcessedTextPayload } from "./interfaces";

//TODO: Move to using envvars
const config = {
	endpoint: process.env.API_URL_DATABASE,
	key: process.env.API_KEY_DATABASE,
	database: {
		id: "training-data-db",
	},
	container: {
		id: "training-data-container",
	},
};

const { endpoint, key } = config;

const options = {
	endpoint,
	key,
	userAgentSuffix: "CosmosDBJavascriptQuickstart",
};

console.log("Connecting to cosmos with options: ", options);

const client = new CosmosClient(options);

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ItemResponse<any>> => {
	// Fetch request payload & headers
	const payload: IProcessedTextPayload = req.body;

	if (!payload.processed_sentences) {
		return null;
	}

	const { database } = await client.databases.createIfNotExists(
		config.database
	);
	const { container } = await database.containers.createIfNotExists(
		config.container
	);

	return await container.items.create({
		timestamp: new Date().valueOf(),
		processed_sentences: payload.processed_sentences,
	});
};

export default httpTrigger;
