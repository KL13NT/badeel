import { For, batch, createSignal } from "solid-js";

import Toggle from "~components/Toggle/Toggle";
import Button from "~components/Button/Button";

import { Filter } from "src/types";

import styles from "./NavigationFilter.module.scss";

import ArrowIcon from "~assets/icons/arrow-down.svg?component-solid";
import { STATUS_FILTER_OPTIONS } from "~constants/filters";
import { useSearchQuery } from "~hooks/useSearchQuery";
import clsx from "clsx";

interface Option {
	key: Filter;
	title: string;
}

export default function NavigationFilter() {
	const [expanded, setExpanded] = createSignal(false);
	const { params, updateFilter } = useSearchQuery();

	const activate = (optionKey: Option["key"]) => {
		const selected = STATUS_FILTER_OPTIONS.find(
			(option) => option.key === optionKey
		)!;

		batch(() => {
			setExpanded(false);
			updateFilter(selected.key);
		});
	};

	const toggleMenu = (updated: boolean) => {
		setExpanded(updated);
	};

	const status = () => params.status ?? "all";
	const rest = () =>
		STATUS_FILTER_OPTIONS.filter((option) => option.key !== status());
	const selected = () =>
		STATUS_FILTER_OPTIONS.find((option) => option.key === status())!;

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
