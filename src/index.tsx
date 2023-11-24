/* @refresh reload */
import { render } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";

import "solid-devtools";

import Router from "./Router";

import "./styles/main.scss";

const root = document.getElementById("root");

registerSW({
	onOfflineReady() {
		alert("The app is ready to work offline");
	},
});

render(() => <Router />, root!);
