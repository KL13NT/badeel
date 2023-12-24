import { onCleanup, onMount } from "solid-js";

import styles from "./LoadingScreen.module.scss";

import PalestineIcon from "~assets/icons/palestine.svg?component-solid";

export default function LoadingScreen() {
	onMount(() => {
		document.querySelector("html")!.style.overflow = "hidden";
	});

	onCleanup(() => {
		document.querySelector("html")!.style.overflow = "unset";
	});

	return (
		<div class={styles.loading} role="alert" aria-live="assertive">
			<div>
				<PalestineIcon />
				<h1>جارِ التحميل</h1>
			</div>
		</div>
	);
}
