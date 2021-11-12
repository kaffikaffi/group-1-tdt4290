import { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/Header";
import Processing from "./pages/Processing";
import Home from "./pages/Home";
import About from "./pages/About";

import "./scss/App.scss";

const App: FC = (): JSX.Element => {
	return (
		<div className="app" id="app">
			<Router>
				<Header />
				<div className="app-content">
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/processing" component={Processing} />
						<Route path="/about" component={About} />
					</Switch>
				</div>
			</Router>
		</div>
	);
};

export default App;
