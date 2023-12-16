import clsx from "clsx";
import { For, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";

import Button from "~components/Button/Button";
import Badge from "~components/Badge/Badge";
import Skeleton from "~components/Skeleton/Skeleton";

import t from "~utils/messages";
import { getProductCategory } from "~utils/categories";
import { STATUS_TITLE_MAPPING } from "~constants/filters";
import { Product } from "~types";

import styles from "./Table.module.scss";

import ViewIcon from "~assets/icons/view.svg?component-solid";

interface Props {
	products: Product[];
	showProof: (product: Product) => void;
	handleSubCategoryChange: (enabled: boolean, ev: MouseEvent) => unknown;
}

export default function Table(props: Props) {
	const [indicatorOpacity, setIndicatorOpacity] = createSignal(0);
	const [activeRowIndex, setActiveRowIndex] = createSignal(0);

	const mouseMoveHandler = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		const row = target.closest("tr");
		const rowIndex = row?.dataset.rowIndex && Number(row.dataset.rowIndex);
		if (typeof rowIndex !== "number" || Number.isNaN(rowIndex)) return;
		setActiveRowIndex(rowIndex);
	};

	const mouseEnterHandler = () => {
		setIndicatorOpacity(1);
	};

	const mouseLeaveHandler = () => {
		setIndicatorOpacity(0);
	};

	return (
		<div class={styles.container}>
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

				<tbody
					onMouseMove={mouseMoveHandler}
					onMouseEnter={mouseEnterHandler}
					onMouseLeave={mouseLeaveHandler}
				>
					<tr
						class={styles.hoverIndicator}
						style={{
							"--opacity": indicatorOpacity(),
							"--active-row-index": activeRowIndex() + 1,
						}}
						aria-hidden
					/>
					<TransitionGroup name="slide-fade-table">
						<For each={props.products}>
							{(result, index) => {
								return (
									<tr data-row-index={index()}>
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
											</div>
										</td>
										<td dir="auto">
											<Badge variant={result.status}>
												{STATUS_TITLE_MAPPING[result.status]}
											</Badge>
										</td>
										<td>
											<button
												onClick={[props.showProof, result]}
												class={styles.details}
											>
												<span>{t("table.showDetails")}</span>
												<ViewIcon />
											</button>
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

export function TableSkeleton() {
	return (
		<div class={styles.container}>
			<table class={clsx(styles.table, styles.tableSkeleton)}>
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
						<For each={new Array(20).fill(null)}>
							{() => {
								return (
									<tr>
										<Skeleton as="td" colspan="10" class={styles.rowSkeleton} />
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
