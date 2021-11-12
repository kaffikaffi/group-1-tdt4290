/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { initialDigestState } from "../misc/initialData";
import { IState } from "../types/interfaces";

// Set initial state
const initialState: IState = {
	username: "",
	password: "",
	isLoggedIn: false,
	processedData: undefined,
	correctedData: {
		digest: { ...initialDigestState },
		processed_sentences: [],
	},
};

// Create user slice
export const stateSlice = createSlice({
	name: "state",
	initialState: { value: initialState },
	reducers: {
		loginUser: (state, action) => {
			state.value = {
				...state.value,
				username: action.payload.username,
				password: action.payload.password,
				isLoggedIn: true,
			};
		},
		logoutUser: (state) => {
			state.value = {
				...state.value,
				username: "",
				password: "",
				isLoggedIn: false,
			};
		},
		setProcessedData: (state, action) => {
			state.value = {
				...state.value,
				processedData: action.payload,
			};
		},
		setCorrectedData: (state, action) => {
			state.value = {
				...state.value,
				correctedData: action.payload,
			};
		},
	},
});

// Export actions
export const { loginUser, logoutUser, setProcessedData, setCorrectedData } =
	stateSlice.actions;

// Export user reducer
export default stateSlice.reducer;
