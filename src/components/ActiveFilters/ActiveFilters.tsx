import Tags from "./Tags";

import { Category, SortOption, View } from "~types";

import styles from "./ActiveFilters.module.scss";

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
					<div class={styles.desktopFilters}>
						<Tags
							openFilters={props.openFilters}
							categories={props.categories}
						/>
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
