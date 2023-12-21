import Button from "~components/Button/Button";
import styles from "./BackToTopButton.module.scss";

import ArrowDown from "~assets/icons/arrow-down.svg?component-solid";
import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Transition } from "solid-transition-group";

export default function BackToTopButton() {
	const [isVisible, setVisible] = createSignal(false);

	const toggleBackToTopVisibility = () => {
		setVisible(window.scrollY > window.innerHeight / 2);
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const focusLogo = () => document.getElementById("logo")?.focus();

	onMount(() => {
		toggleBackToTopVisibility();
		window.addEventListener("scroll", toggleBackToTopVisibility);
	});

	onCleanup(() => {
		window.removeEventListener("scroll", toggleBackToTopVisibility);
	});

	return (
		<Transition name="enter-slide-exit-fade" onAfterExit={focusLogo}>
			<Show when={isVisible()}>
				<Button
					class={styles.backToTopBtn}
					onClick={scrollToTop}
					data-testid="back-to-top-button"
					id="back-to-top"
				>
					<ArrowDown role="presentation" />
					<span>العودة إلى الأعلى</span>
				</Button>
			</Show>
		</Transition>
	);
}
