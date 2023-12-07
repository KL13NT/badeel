import { For, createSignal } from "solid-js";

import Toggle from "~components/Toggle/Toggle";
import Button from "~components/Button/Button";

import styles from "./FiltersModal.module.scss";

import ArrowIcon from "~assets/icons/arrow-down.svg?component-solid";
import clsx from "clsx";

export default function FiltersModal() {
	const [expanded, setExpanded] = createSignal(false);

	const toggleMenu = (updated: boolean) => {
		setExpanded(updated);
	};

	return (
		<div class={styles.navigationFilter}>
			<p class="t-body">انت الآن تُظهر</p>

			<Toggle
				label={selected().title}
				onChange={toggleMenu}
				aria-haspopup="menu"
				pressed={expanded()}
				class={clsx(styles.toggle, styles.activator)}
			>
				<span class="t-body">انت الآن تُظهر</span>

				<div class={styles.filterText}>
					{selected().title}
					<ArrowIcon stroke="currentColor" />
				</div>
			</Toggle>

			<div
				role="menu"
				id="navigation-options"
				class={styles.options}
				aria-expanded={expanded()}
			>
				<For each={rest()}>
					{(option) => {
						return (
							<Button
								onClick={[activate, option.key]}
								role="menuitemradio"
								aria-checked={false}
								tabIndex={expanded() ? 0 : -1}
							>
								{option.title}
							</Button>
						);
					}}
				</For>
			</div>
		</div>
	);
}
