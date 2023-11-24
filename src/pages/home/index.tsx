import { For, createEffect } from "solid-js";

import TypeWriter from "~components/TypeWriter/TypeWriter";
import SearchInput from "~components/SearchInput/SearchInput";
import { TableRowSkeleton } from "~components/Table/TableRow";

import { useDocuments } from "~hooks/useDocuments";
import { useSearchQuery } from "~hooks/useSearchQuery";

import { useProductModal } from "~stores/product-modal";

import { Product, Status } from "~types";

import styles from "./index.module.scss";
import ProductModal from "~components/ProductModal/ProductModal";
import { useFilterQuery } from "~hooks/useFilterQuery";

const statusMapping: Record<Status, string> = {
	alternative: "إدعم",
	boycott: "قاطع",
	unsure: "قيد المراجعة",
};

let searchThrottleTimeout: number | number = 0;

function App() {
	const { query, updateQuery } = useSearchQuery();
	const { status } = useFilterQuery();
	const { search, results } = useDocuments();
	const [, setProductModal] = useProductModal();

	createEffect(() => {
		if (query || status) {
			search(query);
		}
	});

	const handleSubmit = (query: string) => {
		clearTimeout(searchThrottleTimeout);

		searchThrottleTimeout = setTimeout(() => {
			updateQuery(query);
			search(query);
		}, 250);
	};

	const showProof = (product: Product) => {
		setProductModal({
			product,
		});
	};

	return (
		<main class={styles.container}>
			<div class={styles.intro}>
				<TypeWriter />
				<p>قائمة بشركات والمنتجات المطلوب مقاطعتها لدعم القضية الفلسطينية.</p>
				<SearchInput onSubmit={handleSubmit} value={query} />
			</div>
			<section>
				<ProductModal />

				<table class="table">
					<thead class="thead">
						<tr>
							<th class="td">الحالة</th>
							<th class="td">اسم المنتج</th>
							<th class="td">الاسم بالإنجليزية</th>
							<th class="td">الشركة المصنّعة</th>
							<th class="td">الدليل</th>
						</tr>
					</thead>

					<tbody class="tbody">
						<TableRowSkeleton />
						<For each={results()}>
							{(result) => {
								return (
									<tr>
										<td class="td" dir="auto">
											{statusMapping[result.item.status]}
										</td>
										<td class="td" dir="auto">
											{result.item.Name}
										</td>
										<td class="td" dir="auto">
											{result.item["English Name"]}
										</td>
										<td class="td" dir="auto">
											{result.item.Manufacturer}
										</td>
										<td class="td">
											<button onClick={[showProof, result.item]}>الدليل</button>
										</td>
									</tr>
								);
							}}
						</For>
					</tbody>
				</table>
			</section>
		</main>
	);
}

export default App;
