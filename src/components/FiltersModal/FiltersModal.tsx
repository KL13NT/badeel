import { For, JSX } from "solid-js";
import { createStore } from "solid-js/store";

import Combobox from "~components/Combobox/Combobox";
import Checkbox from "~components/Checkbox/Checkbox";
import Button from "~components/Button/Button";

import { useSearchQuery } from "~hooks/useSearchQuery";
import { getCategoryByKey } from "~utils/categories";
import t from "~utils/messages";

import {
	SORT_OPTIONS,
	STATUS_FILTER_CHECKBOX_OPTIONS,
} from "~constants/filters";
import { Category, Filter, SortOption } from "~types";

import styles from "./FiltersModal.module.scss";

import CloseIcon from "~assets/icons/x.svg?component-solid";
import Modal from "~components/Modal/Modal";

interface Props {
	categories: Category[];
	close: () => void;
}

let ref: HTMLDivElement;

export default function FiltersModal(props: Props) {
	const { major, sub, status, sort, updateParams } = useSearchQuery();
	const [state, setState] = createStore({
		major: major(),
		sub: sub(),
		status: status(),
		sort: sort(),
	});

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
			sort: undefined,
			page: 1,
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

	const apply = () => {
		updateParams({
			major: state.major,
			sub: JSON.stringify(state.sub),
			status: JSON.stringify(state.status),
			sort: state.sort,
			page: 1,
		});

		props.close();
	};

	const selectedMajor = () => {
		const category =
			state.major && props.categories.length > 0
				? getCategoryByKey(state.major)
				: undefined;

		if (category)
			return {
				name: category.arabic,
				value: category.english,
			};
	};

	const selectedSort = () =>
		SORT_OPTIONS.find((option) => option.value === state.sort);

	const handleSortChange = (selected: string) => {
		setState({
			sort: selected as SortOption,
		});
	};

	return (
		<Modal close={props.close} id="filters-modal">
			<div class={styles.filtersModal} ref={ref}>
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
							value={selectedMajor()}
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

					<div class={styles.section}>
						<p
							class={styles.title}
							data-active={state.sort && state.sort !== "accuracy"}
						>
							{t("filters.sort")}
						</p>

						<Combobox
							options={SORT_OPTIONS}
							onSelect={handleSortChange}
							id="sort-selection"
							label={"ترتيب حسب"}
							default={{
								name: "بدون ترتيب",
								value: "accuracy",
							}}
							value={selectedSort()}
						/>
					</div>
				</div>

				<div class={styles.footer}>
					<Button variant="action-invert" class={styles.action} onClick={apply}>
						{t("filters.results")}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
