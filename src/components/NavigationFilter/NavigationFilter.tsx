import { For, batch, createSignal, onMount } from "solid-js";

import Toggle from "~components/Toggle/Toggle";
import Button from "~components/Button/Button";

import { useFilterStore } from "~stores/filter";
import { useFilterQuery } from "~hooks/useFilterQuery";

import { Filter } from "src/types";

import styles from "./NavigationFilter.module.scss";

import ArrowIcon from "~assets/icons/arrow-down.svg?component-solid";

interface Option {
	key: Filter;
	title: string;
}

export default function NavigationFilter() {
	const [state, setState] = useFilterStore;
	const [expanded, setExpanded] = createSignal(false);
	const { status, updateStatus } = useFilterQuery();

	const activate = (optionKey: Option["key"]) => {
		const selected = state.options.find((option) => option.key === optionKey)!;

		batch(() => {
			setExpanded(false);
			updateStatus(selected.key);

			setState({
				selected,
			});
		});
	};

	const toggleMenu = (updated: boolean) => {
		setExpanded(updated);
	};

	onMount(() => {
		if (status) {
			activate(status);
		}
	});

	const rest = () =>
		state.options.filter((option) => option.key !== state.selected.key);

	return (
		<div class={styles.navigationFilter}>
			<p class="t-body">انت الآن تُظهر</p>

			<Toggle
				label={state.selected.title}
				onChange={toggleMenu}
				aria-haspopup="menu"
				pressed={expanded()}
				class={styles.toggle}
			>
				{state.selected.title}

				<ArrowIcon stroke="currentColor" />
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
