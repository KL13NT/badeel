/* eslint-disable solid/no-innerhtml */
import { Show, batch, onMount } from "solid-js";
import { Transition } from "solid-transition-group";

import Modal from "~components/Modal/Modal";
import Button from "~components/Button/Button";

import { getAllChangelogs, shouldDisplayChangelogs } from "~utils/changelogs";
import { changelogsSignal, setChangelogsSignal } from "~stores/changelogs";
import { toggleOverlay } from "~stores/overlay";

import styles from "./Changelog.module.scss";

import CloseIcon from "~assets/icons/close.svg?component-solid";
import t from "~utils/messages";

export default function Changelog() {
	onMount(async () => {
		if (!shouldDisplayChangelogs()) {
			return;
		}

		const contents = await getAllChangelogs();

		batch(() => {
			setChangelogsSignal(contents);
			toggleOverlay("changelog-modal", true);
		});
	});

	const handleClose = () => {
		batch(() => {
			setChangelogsSignal(null);
			toggleOverlay("changelog-modal", false);
			localStorage.setItem("latest-changelog", new Date().toString());
		});
	};

	return (
		<Transition name="slide-fade">
			<Show when={changelogsSignal()}>
				<Modal id="updates-modal" close={handleClose}>
					<section class={styles.body}>
						<div class={styles.content}>
							<div innerHTML={changelogsSignal()!} />
						</div>

						<Button
							onClick={handleClose}
							class={styles.close}
							aria-label={t("close")}
							variant="action-invert"
						>
							<CloseIcon role="presentation" />
						</Button>
					</section>
				</Modal>
			</Show>
		</Transition>
	);
}
