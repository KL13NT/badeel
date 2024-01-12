import { createSignal } from "solid-js";
import { BeforeInstallPromptEvent } from "~types";

export const [installEventSignal, setInstallEventSignal] =
	createSignal<BeforeInstallPromptEvent | null>(null);
