/* @refresh reload */
import { render } from "solid-js/web";


if (import.meta.env.DEV) {
	await import("solid-devtools");
}

import Router from "./Router";
import { listenForInstall } from "~utils/install";

import "./styles/main.scss";

const root = document.getElementById("root");

listenForInstall();

render(() => <Router />, root!);
