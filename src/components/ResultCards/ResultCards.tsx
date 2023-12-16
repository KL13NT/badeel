import { For } from "solid-js";

import Button from "~components/Button/Button";
import Badge from "~components/Badge/Badge";

import { getProductCategory } from "~utils/categories";
import { STATUS_TITLE_MAPPING } from "~constants/filters";
import t from "~utils/messages";

import { Product } from "~types";

import styles from "./ResultCards.module.scss";

import ViewIcon from "~assets/icons/view.svg?component-solid";
import { TransitionGroup } from "solid-transition-group";

interface ResultCardsProps {
	products: Product[];
	showProof: (product: Product) => void;
	handleSubCategoryChange: (enabled: boolean, ev: MouseEvent) => unknown;
}

export default function ResultCards(props: ResultCardsProps) {
	return (
		<div class={styles.results}>
			<TransitionGroup name="slide-fade-cards">
				<For each={props.products}>
					{(product) => (
						<div class={styles.result}>
							<p class={styles.name}>{product.Name}</p>
							<p class={styles.englishName}>{product["English Name"]}</p>

							<Button
								data-category={product.Category}
								class={styles.category}
								onClick={[props.handleSubCategoryChange, true]}
							>
								{getProductCategory(product).arabic}
							</Button>

							<div class={styles.footer}>
								<Badge variant={product.status}>
									{STATUS_TITLE_MAPPING[product.status]}
								</Badge>

								<button
									onClick={[props.showProof, product]}
									class={styles.details}
								>
									<span>{t("table.showDetails")}</span>
									<ViewIcon />
								</button>
							</div>
						</div>
					)}
				</For>
			</TransitionGroup>
		</div>
	);
}
