/* @refresh reload */
import { render } from "solid-js/web";

import "solid-devtools";

import Router from "./Router";

import "./styles/main.scss";

const root = document.getElementById("root");

render(() => <Router />, root!);
