import { useEffect } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";

import { IState } from "../types/interfaces";
import { loginUser } from "../features/state";

/**
 * Synchronizes local storage login details with redux storage
 */
const useLoginDetails = (): void => {
	const state: IState = useSelector(
		(state: RootStateOrAny) => state.state.value
	);
	const dispatch = useDispatch();

	// Fetches username & password from local storage
	useEffect(() => {
		console.log("[useEffect] Fetch user details");

		// Fetch values from local storage
		const username = localStorage.getItem("username");
		const password = localStorage.getItem("password");

		// If local storage has username && password, update state
		if (username && password) {
			dispatch(loginUser({ username, password })); // Set state with details
		}
	}, []);

	// Updates username & password on change
	useEffect(() => {
		console.log("[useEffect] Set user details");

		if (state.username && state.password) {
			localStorage.setItem("username", state.username);
			localStorage.setItem("password", state.password);
		}
	}, [state.username, state.password]);
};

export default useLoginDetails;
