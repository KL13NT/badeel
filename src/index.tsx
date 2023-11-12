/* @refresh reload */
import { render } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";

import "./style.css";
import App from "./App";

const root = document.getElementById("root");

registerSW({
	onOfflineReady() {
		alert("The app is ready to work offline");
	},
});

render(() => <App />, root!);
