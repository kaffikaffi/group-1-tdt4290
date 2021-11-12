import task from "@cypress/code-coverage/task";

module.exports = (on, config) => {
	task(on, config);
	return config;
};
