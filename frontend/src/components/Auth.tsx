import { FC, useState } from "react";
import { useDispatch } from "react-redux";

import { loginUser } from "../features/state";
import Button from "./Button";
import InputField from "./InputField";

import "../scss/components/Auth.scss";

interface IAuthenticationProps {}

const Auth: FC<IAuthenticationProps> = (): JSX.Element => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const dispatch = useDispatch();

	/**
	 * Saves user info to state
	 */
	const handleLogin = () => {
		dispatch(loginUser({ username, password })); // Set user state
	};

	return (
		<div className="auth" id="auth">
			<h1>Login</h1>
			<p>Please log into your account...</p>
			<InputField
				id="usernameInput"
				name="username"
				variable="Username"
				value={username}
				setValue={(s: string) => setUsername(s)}
			/>
			<InputField
				id="passwordInput"
				name="password"
				variable="Password"
				value={password}
				setValue={(s: string) => setPassword(s)}
			/>
			<Button id="authBtn" name="Login" onClick={handleLogin} />
		</div>
	);
};

export default Auth;
