import { useRegisterSW } from "virtual:pwa-register/solid";
import { Show } from "solid-js";
import { Transition } from "solid-transition-group";

import Button from "~components/Button/Button";

import styles from "./OfflinePrompt.module.scss";

export default function OfflinePrompt() {
	const {
		offlineReady: [offlineReady, setOfflineReady],
	} = useRegisterSW({
		immediate: true,
	});

	const close = () => {
		setOfflineReady(false);
	};

	return (
		<Transition name="slide-fade">
			<Show when={offlineReady()}>
				<div aria-modal="true" role="dialog" tabIndex="-1" class="overlay">
					<div class={styles.body}>
						<p class="t-button">التطبيق جاهز للعمل بدون إنترنت.</p>

						<Button
							onClick={close}
							variant="action-invert"
							class={styles.action}
						>
							أغلق النافذة
						</Button>
					</div>
				</div>
			</Show>
		</Transition>
	);
}
