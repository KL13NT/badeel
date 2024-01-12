import { createSignal } from "solid-js";

export const [overlaySignal, setOverlaySignal] = createSignal<string[]>([]);

export const toggleOverlay = (name: string, state = true) => {
	if (!state) {
		setOverlaySignal(overlaySignal().filter((overlay) => overlay !== name));
	} else {
		setOverlaySignal([...overlaySignal(), name]);
	}
};

export const hasOverlay = () => overlaySignal().length > 0;
