import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css"; // Bootstrap

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below.
serviceWorker.unregister();

const topLevel = (
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);

ReactDOM.render(topLevel, document.getElementById("root"));