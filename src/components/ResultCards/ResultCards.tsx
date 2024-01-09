import { For, Show } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import clsx from "clsx";

import Button from "~components/Button/Button";
import Badge from "~components/Badge/Badge";
import Skeleton from "~components/Skeleton/Skeleton";

import { getProductCategory } from "~utils/categories";
import { STATUS_TITLE_MAPPING } from "~constants/filters";
import t from "~utils/messages";

import { Product } from "~types";

import styles from "./ResultCards.module.scss";

import ViewIcon from "~assets/icons/view.svg?component-solid";
import AlternativesIcon from "~assets/icons/alternatives.svg?component-solid";

interface ResultCardsProps {
	products: Product[];
	showProof: (product: Product) => void;
	showAlternatives: (product: Product) => void;
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

								<div>
									<Show when={product.status === "boycott"}>
										<button
											onClick={[props.showAlternatives, product]}
											class={styles.details}
										>
											<span>{t("table.showAlternative")}</span>
											<AlternativesIcon role="presentation" />
										</button>
									</Show>
									<button
										onClick={[props.showProof, product]}
										class={styles.details}
									>
										<span>{t("table.showDetails")}</span>
										<ViewIcon role="presentation" />
									</button>
								</div>
							</div>
						</div>
					)}
				</For>
			</TransitionGroup>
		</div>
	);
}

export function ResultCardsSkeleton() {
	return (
		<div class={styles.results}>
			<TransitionGroup name="slide-fade-cards">
				<For each={new Array(20).fill(null)}>
					{() => {
						return (
							<tr>
								<Skeleton
									as="div"
									colspan="10"
									class={clsx(styles.result, styles.skeleton)}
								/>
							</tr>
						);
					}}
				</For>
			</TransitionGroup>
		</div>
	);
}
