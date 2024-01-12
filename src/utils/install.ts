import { setInstallEventSignal } from "~stores/install";

import { BeforeInstallPromptEvent } from "~types";

const handleBeforeInstall = (event: Event) => {
	setInstallEventSignal(event as BeforeInstallPromptEvent);
	window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
};

export const listenForInstall = () => {
	window.addEventListener("beforeinstallprompt", handleBeforeInstall);
};
