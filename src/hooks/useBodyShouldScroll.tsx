import { createEffect } from "solid-js";
import { hasOverlay } from "~stores/overlay";

export default function useBodyShouldScroll() {
	createEffect(() => {
		if (hasOverlay()) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	});
}
