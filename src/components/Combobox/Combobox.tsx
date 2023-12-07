import { For, Show, createSignal, onMount } from "solid-js";

import styles from "./Combobox.module.scss";
import { Transition } from "solid-transition-group";

import ArrowDownIcon from "~assets/icons/arrow-down.svg?component-solid";

type Option = {
	name: string;
	value: string;
};

interface Props {
	options: Option[];
	id: string;
	label: string;
	value?: string;
	default?: Option;
	onSelect: (option: string) => void;
}

export default function Combobox(props: Props) {
	const [expanded, setExpanded] = createSignal(false);

	const toggle = () => {
		setExpanded(!expanded());
	};

	const handleSelect = (ev: MouseEvent) => {
		const target = ev.target as HTMLUListElement;

		setExpanded(false);

		props.onSelect(target.dataset.value!);
	};

	const handleKeyUp = () => {};

	onMount(() => {
		document.addEventListener("click", (ev) => {
			const target = ev.target as HTMLElement;

			if (expanded() && !target.closest(`.${styles.combobox}`)) {
				setExpanded(false);
			}
		});
	});

	return (
		<div class={styles.combobox} aria-expanded={expanded()}>
			<button
				id={`${props.id}-activator`}
				aria-label={props.label}
				aria-controls={`${props.id}`}
				onClick={toggle}
				class={styles.activator}
			>
				{props.value ?? props.default?.name ?? props.label}
				<ArrowDownIcon />
			</button>

			<Transition name="slide-fade-down">
				<Show when={expanded()}>
					<div class={styles.content} tabIndex={-1}>
						<ul
							id={`${props.id}`}
							role="listbox"
							aria-label={props.label}
							tabIndex={-1}
							class={styles.options}
							onClick={handleSelect}
							onKeyUp={handleKeyUp}
						>
							{props.default && (
								<li
									id={props.default.value}
									role="option"
									data-value={props.default.value}
									tabIndex={0}
									class={styles.option}
								>
									{props.default.name}
								</li>
							)}

							<For each={props.options}>
								{(option) => (
									<li
										id={option.value}
										role="option"
										data-value={option.value}
										tabIndex={0}
										class={styles.option}
									>
										{option.name}
									</li>
								)}
							</For>
						</ul>
					</div>
				</Show>
			</Transition>
		</div>
	);
}
