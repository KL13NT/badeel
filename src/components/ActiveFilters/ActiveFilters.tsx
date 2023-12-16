import { Show } from "solid-js";

import Tags from "./Tags";
import Toggle from "~components/Toggle/Toggle";

import t from "~utils/messages";

import { Category, SortOption, View } from "~types";

import styles from "./ActiveFilters.module.scss";

import CardsToggleIcon from "~assets/icons/cards-toggle.svg?component-solid";
import TableToggleIcon from "~assets/icons/table-toggle.svg?component-solid";

const sortKeyMessageMap: Record<SortOption, string> = {
	accuracy: t("sort.accuracy"),
	status: t("sort.status"),
	Name: t("sort.arabicName"),
	Category: t("sort.category"),
	"English Name": t("sort.englishName"),
};

interface ActiveFiltersProps {
	categories: Category[];
	active: number;
	sort: SortOption;
	view: View;
	openFilters: () => void;
	clear: () => void;
	switchView: (view: View) => void;
}

export default function ActiveFilters(props: ActiveFiltersProps) {
	return (
		<>
			<div class={styles.activeFilters}>
				<div class={styles.right}>
					<p>
						{t("show")} {sortKeyMessageMap[props.sort]}
					</p>

					<div class={styles.desktopFilters}>
						<Tags
							openFilters={props.openFilters}
							categories={props.categories}
						/>
					</div>
				</div>

				<div class={styles.left}>
					<Show when={props.active > 0}>
						<button class={styles.clear} onClick={() => props.clear()}>
							{t("filters.clear")}
						</button>
					</Show>
					<div class={styles.separator} />
					<div class={styles.view}>
						<Toggle
							class={styles.toggle}
							label={t("view.cards")}
							onChange={() => props.switchView("cards")}
							pressed={props.view === "cards"}
						>
							<CardsToggleIcon />
						</Toggle>
						<Toggle
							class={styles.toggle}
							label={t("view.table")}
							onChange={() => props.switchView("table")}
							pressed={props.view === "table"}
						>
							<TableToggleIcon />
						</Toggle>
					</div>
				</div>
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
