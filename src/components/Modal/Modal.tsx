import { JSX, onCleanup, onMount } from "solid-js";

import styles from "./Modal.module.scss";

interface ModalProps {
	close: () => void;
	id: string;
	children: JSX.Element;
}

let ref: HTMLDivElement | undefined;
const overlayTargets = [".overlay", `.${styles.modal}`];

export default function Modal(props: ModalProps) {
	const handleKeyUp = (ev: KeyboardEvent) => {
		if (ev.key.toLowerCase() === "escape") {
			props.close();
		}
	};

	const handleClickOutside = (ev: MouseEvent) => {
		const target = ev.target as HTMLElement;

		if (
			!target.closest(`.${styles.modal} :first-child`) &&
			overlayTargets.some((element) => target.closest(element))
		) {
			props.close();
		}
	};

	onMount(() => {
		if (ref) {
			ref.focus();
		}

		document.addEventListener("click", handleClickOutside);
	});

	onCleanup(() => {
		document.removeEventListener("click", handleClickOutside);
	});

	return (
		<div
			role="dialog"
			aria-modal="true"
			class={styles.modal}
			id={props.id}
			ref={ref}
			tabIndex="-1"
			onKeyUp={handleKeyUp}
		>
			{props.children}
		</div>
	);
}
