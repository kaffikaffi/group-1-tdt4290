import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import stateReducer from "./features/state";

const store = configureStore({
	reducer: {
		state: stateReducer,
	},
});

ReactDOM.render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
	document.getElementById("root")
);
