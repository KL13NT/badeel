import { Show } from "solid-js";

import Button from "~components/Button/Button";

import { getCategoryByKey, getCategoryMajor } from "~utils/categories";
import { useSearchQuery } from "~hooks/useSearchQuery";
import { localizeNumber } from "~utils/common";
import t, { MessageKey } from "~utils/messages";

import { Category } from "~types";

import styles from "./ActiveFilters.module.scss";

import CloseIcon from "~assets/icons/x-2.svg?component-solid";

interface ActiveFiltersProps {
	categories: Category[];
	total: number;
	current: number;
	active: number;
	openFilters: () => void;
	clear: () => void;
}

interface TagsProps {
	categories: Category[];
	openFilters: () => void;
}

function Tags(props: TagsProps) {
	const { sub, status, query, major, updateParams } = useSearchQuery();

	const handleClearFilter = (filter: string[]) => {
		const update: Record<string, undefined | number> = {
			page: 1,
		};

		filter.forEach((key) => {
			update[key] = undefined;
		});

		updateParams(update);
	};

	return (
		<>
			<Show when={query()}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="query"
					onClick={[handleClearFilter, ["query"]]}
				>
					<span>{t("filters.search")}: </span>
					{query()}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={status() && status().length > 0}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="status"
					onClick={[handleClearFilter, ["status"]]}
				>
					<span>{t("filters.status")}: </span>
					{status()
						.map((status) => t(`filters.${status}` as MessageKey))
						.join(", ")}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={major() && props.categories.length > 0}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="major"
					onClick={[handleClearFilter, ["major", "sub"]]}
				>
					{getCategoryByKey(major() as string).arabic}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={sub() && sub().length >= 1 && props.categories.length > 0}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="sub"
					onClick={() =>
						sub().length === 1
							? handleClearFilter(["sub"])
							: props.openFilters()
					}
				>
					<span>{getCategoryMajor(sub()[0]).arabic}: </span>
					{getCategoryByKey(sub()[0]).arabic}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={sub().length > 1}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="sub"
					onClick={props.openFilters}
				>
					+{localizeNumber(sub().length - 1)}
				</Button>
			</Show>
		</>
	);
}

export default function ActiveFilters(props: ActiveFiltersProps) {
	return (
		<>
			<div class={styles.activeFilters}>
				<div class={styles.right}>
					<p>
						{t("show")}{" "}
						<span class="t-body">{localizeNumber(props.current)}</span>{" "}
						{t("product")} {t("of")}{" "}
						<span class="t-body">{localizeNumber(props.total)}</span>{" "}
						{t("product")}
					</p>

					<div class={styles.desktopFilters}>
						<Tags
							openFilters={props.openFilters}
							categories={props.categories}
						/>
					</div>
				</div>

				<Show when={props.active > 0}>
					<button class={styles.clear} onClick={() => props.clear()}>
						{t("filters.clear")}
					</button>
				</Show>
			</div>

			<div class={styles.overlayContainer}>
				<div class={styles.mobileFilters}>
					<div>
						<Tags
							openFilters={props.openFilters}
							categories={props.categories}
						/>
					</div>
				</div>

				<div class={styles.overlay} />
			</div>
		</>
	);
}
