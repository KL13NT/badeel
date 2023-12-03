import clsx from "clsx";
import { For } from "solid-js";

import { Category, Product } from "~types";
import { STATUS_TITLE_MAPPING } from "~constants/filters";
import Button from "~components/Button/Button";
import { localizeNumber } from "~utils/common";
import t from "~utils/messages";
import { getParentCategory, getProductCategory } from "~utils/categories";
import Badge from "~components/Badge/Badge";
import { TransitionGroup } from "solid-transition-group";

import styles from "./Table.module.scss";

interface Props {
	products: Product[];
	total: number;
	categories: Category[];
	handleSubCategoryChange: (enabled: boolean, ev: MouseEvent) => unknown;
	handleMajorCategoryChange: (enabled: boolean, ev: MouseEvent) => unknown;
	showProof: (product: Product) => void;
}

export default function Table(props: Props) {
	return (
		<div class={styles.container}>
			<div class={clsx("t-button", styles.intro)}>
				<p>
					{t("show")}{" "}
					<span class="t-body">{localizeNumber(props.products.length)}</span>{" "}
					{t("product")} {t("of")}{" "}
					<span class="t-body">{localizeNumber(props.total)}</span>{" "}
					{t("product")}
				</p>
				<div />
			</div>
			<table class={styles.table}>
				<thead>
					<tr>
						<th>{t("table.name")}</th>
						<th>{t("table.englishName")}</th>
						<th>{t("table.category")}</th>
						<th>{t("table.status")}</th>
						<th />
					</tr>
				</thead>

				<tbody>
					<TransitionGroup name="slide-fade-table">
						<For each={props.products}>
							{(result) => {
								return (
									<tr>
										<td dir="auto">{result.Name}</td>
										<td dir="auto">{result["English Name"]}</td>
										<td class={styles.category}>
											<div>
												<Button
													data-category={result.Category}
													onClick={[props.handleSubCategoryChange, true]}
												>
													{getProductCategory(result).arabic}
												</Button>
												<Button
													data-category={getParentCategory(result).english}
													onClick={[props.handleMajorCategoryChange, true]}
												>
													{getParentCategory(result).arabic}
												</Button>
											</div>
										</td>
										<td dir="auto">
											<Badge variant={result.status}>
												{STATUS_TITLE_MAPPING[result.status]}
											</Badge>
										</td>
										<td>
											<Button
												onClick={[props.showProof, result]}
												class={styles.details}
											>
												<span>عرض المزيد</span>
											</Button>
										</td>
									</tr>
								);
							}}
						</For>
					</TransitionGroup>
				</tbody>
			</table>
		</div>
	);
}
