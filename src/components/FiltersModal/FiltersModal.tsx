import { For, JSX, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import Combobox from "~components/Combobox/Combobox";
import Checkbox from "~components/Checkbox/Checkbox";
import Button from "~components/Button/Button";

import { useSearchQuery } from "~hooks/useSearchQuery";
import { getCategoryByKey } from "~utils/categories";
import t from "~utils/messages";

import { STATUS_FILTER_CHECKBOX_OPTIONS } from "~constants/filters";
import { Category, Filter } from "~types";

import styles from "./FiltersModal.module.scss";

import CloseIcon from "~assets/icons/x.svg?component-solid";

interface Props {
	categories: Category[];
	close: () => void;
}

let ref: HTMLDivElement | undefined;
export default function FiltersModal(props: Props) {
	const { params, sub, status, updateParams } = useSearchQuery();
	const [state, setState] = createStore({
		major: params.major,
		sub: sub(),
		status: status(),
	});

	const handleKeyUp = (ev: KeyboardEvent) => {
		if (ev.key.toLowerCase() === "escape") {
			props.close();
		}
	};

	const handleCategoryChange = (value: string) => {
		if (value === "all") {
			setState({
				major: undefined,
				sub: undefined,
			});
		} else {
			setState({
				major: value,
				sub: [],
			});
		}
	};

	const clear = () => {
		updateParams({
			major: undefined,
			sub: undefined,
			status: undefined,
		});

		props.close();
	};

	const handleSubChange: JSX.ChangeEventHandlerUnion<
		HTMLInputElement,
		Event
	> = (ev) => {
		const target = ev.target as HTMLInputElement;
		const initial = state.sub ?? [];
		const updated = target.checked
			? ([...initial, target.value] as Filter[])
			: initial.filter((option) => option !== target.value);

		setState({
			sub: updated,
		});
	};

	const handleStatusChange: JSX.ChangeEventHandlerUnion<
		HTMLInputElement,
		Event
	> = (ev) => {
		const target = ev.target as HTMLInputElement;
		const initial = state.status ?? [];
		const updated = target.checked
			? ([...initial, target.value] as Filter[])
			: initial.filter((option) => option !== target.value);

		setState({
			status: updated,
		});
	};

	const handleClickOutside = (ev: MouseEvent) => {
		const target = ev.target as HTMLElement;

		if (!target.closest(`.${styles.filtersModal}`)) {
			props.close();
		}
	};

	const apply = () => {
		updateParams({
			major: state.major,
			sub: JSON.stringify(state.sub),
			status: JSON.stringify(state.status),
		});

		props.close();
	};

	onMount(() => {
		document.addEventListener("click", handleClickOutside);

		if (ref) {
			ref.focus();
		}
	});

	onCleanup(() => {
		document.removeEventListener("click", handleClickOutside);
	});

	return (
		<div
			class={styles.filtersModal}
			role="dialog"
			aria-modal="true"
			id="filters-modal"
			tabIndex="-1"
			ref={ref}
			onKeyUp={handleKeyUp}
		>
			<div class={styles.content}>
				<div class={styles.header}>
					<h2>{t("filters.title")}</h2>

					<div class={styles.actions}>
						<button onClick={clear} class={styles.clear}>
							{t("filters.clear")}
						</button>
						<button onClick={() => props.close()} class={styles.close}>
							<CloseIcon />
						</button>
					</div>
				</div>

				<div class={styles.section}>
					<p class={styles.title} data-active={Boolean(state.major)}>
						{t("filters.category")}
					</p>

					<Combobox
						options={props.categories
							.filter((category) => !category.major)
							.map((category) => ({
								value: category.english,
								name: category.arabic,
							}))}
						default={{
							name: "جميع المنتجات",
							value: "all",
						}}
						onSelect={handleCategoryChange}
						id="category-selection"
						label={t("filters.list.category")}
						value={
							state.major && props.categories.length > 0
								? getCategoryByKey(state.major).arabic
								: undefined
						}
					/>
				</div>

				{state.major ? (
					<div class={styles.section}>
						<p class={styles.title} data-active={state.sub.length > 0}>
							{t("filters.subcategory")}
						</p>

						<For
							each={props.categories.filter(
								(category) => category.major === state.major
							)}
						>
							{(category) => (
								<Checkbox
									label={category.arabic}
									value={category.english}
									id={category.english}
									name="subcategory"
									onChange={handleSubChange}
									checked={sub().includes(category.english)}
								/>
							)}
						</For>
					</div>
				) : null}

				<div class={styles.section}>
					<p class={styles.title} data-active={state.status.length > 0}>
						{t("filters.status")}
					</p>

					<For each={STATUS_FILTER_CHECKBOX_OPTIONS}>
						{(option) => (
							<Checkbox
								label={option.title}
								value={option.value}
								id={option.value}
								name="status"
								onChange={handleStatusChange}
								checked={status().includes(option.value)}
							/>
						)}
					</For>
				</div>
			</div>

			<div class={styles.footer}>
				<Button variant="action-invert" class={styles.action} onClick={apply}>
					{t("filters.results")}
				</Button>
			</div>
		</div>
	);
}