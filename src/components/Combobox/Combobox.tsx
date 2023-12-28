import { For, Show, createSignal, onMount } from "solid-js";

import styles from "./Combobox.module.scss";
import { Transition } from "solid-transition-group";

import ArrowDownIcon from "~assets/icons/arrow-down.svg?component-solid";

type Option = {
	name: string;
	value: unknown;
};

interface Props {
	options: Option[];
	id: string;
	label: string;
	value?: Option;
	default?: Option;
	alwaysDisplayLabel?: boolean;
	onSelect: (option: string) => void;
}

interface LabelProps {
	alwaysDisplayLabel?: boolean;
	label: string;
	value?: Option;
	default?: Option;
}

function Label(props: LabelProps) {
	return (
		<>
			<Show when={props.alwaysDisplayLabel}>
				{props.label} {props.value?.name ?? props.default?.name}
			</Show>

			<Show when={!props.alwaysDisplayLabel}>
				{props.value?.name ?? props.default?.name ?? props.label}
			</Show>
		</>
	);
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
				<Label
					label={props.label}
					default={props.default}
					value={props.value}
					alwaysDisplayLabel={props.alwaysDisplayLabel}
				/>
				<ArrowDownIcon role="presentation" />
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
									id={String(props.default.value)}
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
										id={String(option.value)}
										role="option"
										data-value={option.value}
										data-active={option.value === props.value?.value}
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
