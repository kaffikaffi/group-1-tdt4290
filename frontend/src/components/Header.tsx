import { FC } from "react";
import { useHistory } from "react-router-dom";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";

import { IState } from "../types/interfaces";

import "../scss/components/Header.scss";
import { logoutUser } from "../features/state";

const Header: FC = (): JSX.Element => {
	const history = useHistory();
	const state: IState = useSelector(
		(state: RootStateOrAny) => state.state.value
	);
	const dispatch = useDispatch();

	/**
	 * Logs out user
	 */
	const logout = (): void => {
		dispatch(logoutUser()); // Removes user from redux state
	};

	return (
		<div className="header">
			<div className="header-content">
				<div className="header-content-logo" onClick={() => history.push("/")}>
					mTerms
				</div>
				<div className="header-content-links">
					<div
						className="header-content-link"
						onClick={() => history.push("/processing")}
					>
						Processing
					</div>
					<div
						className="header-content-link"
						onClick={() => history.push("/about")}
					>
						About
					</div>
					{state.isLoggedIn && (
						<div className="header-content-link" onClick={logout}>
							Logout
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;
