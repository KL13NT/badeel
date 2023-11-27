import clsx from "clsx";
import { For } from "solid-js";

import { Category, Product } from "~types";
import { STATUS_TITLE_MAPPING } from "~constants/filters";
import Button from "~components/Button/Button";
import { localizeNumber } from "~utils/common";
import t from "~utils/messages";
import { getParentCategory, getProductCategory } from "~utils/categories";
import Badge from "~components/Badge/Badge";

import styles from "./Table.module.scss";

interface Props {
	products: Product[];
	categories: Category[];
	showProof: (product: Product) => void;
}

export default function Table(props: Props) {
	return (
		<div class={styles.container}>
			<div class={clsx("t-button", styles.intro)}>
				<p>
					{t("show")}{" "}
					<span class="t-body">{localizeNumber(props.products.length)}</span>{" "}
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
					<For each={props.products}>
						{(result) => {
							return (
								<tr>
									<td dir="auto">{result.Name}</td>
									<td dir="auto">{result["English Name"]}</td>
									<td class={styles.category}>
										<div>
											<Button>{getProductCategory(result).arabic}</Button>
											<Button>{getParentCategory(result).arabic}</Button>
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
				</tbody>
			</table>
		</div>
	);
}
