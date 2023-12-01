import TypeWriter from "~components/TypeWriter/TypeWriter";
import SearchInput from "~components/SearchInput/SearchInput";

import { getCategoryMajor } from "~utils/categories";
import { useDocuments } from "~hooks/useDocuments";
import { useSearchQuery } from "~hooks/useSearchQuery";

import { useProductModal } from "~stores/product-modal";

import { Product } from "~types";

import styles from "./index.module.scss";
import ProductModal from "~components/ProductModal/ProductModal";
import Table from "~components/Table/Table";
import Filters from "~components/Filters/Filters";
import { A } from "@solidjs/router";
import Button from "~components/Button/Button";
import t from "~utils/messages";

let searchThrottleTimeout: number | number = 0;

function App() {
	const { params, updateParams } = useSearchQuery();
	const { search, results, categories, error, total, hasMore, showMore } =
		useDocuments();
	const [, setProductModal] = useProductModal();

	const handleSubmit = (query: string) => {
		clearTimeout(searchThrottleTimeout);

		searchThrottleTimeout = setTimeout(() => {
			search(query);
		}, 250);
	};

	const showProof = (product: Product) => {
		setProductModal({
			product,
		});
	};

	const handleMajorCategoryChange = (enabled: boolean, ev: MouseEvent) => {
		const target = ev.target as HTMLButtonElement;
		const category = target.dataset.category!;

		if (enabled) {
			updateParams({
				query: undefined,
				major: category,
				sub: undefined,
			});
		}
	};

	const handleSubCategoryChange = (enabled: boolean, ev: MouseEvent) => {
		const target = ev.target as HTMLButtonElement;
		const category = target.dataset.category!;

		if (enabled) {
			const major = category === "all" ? undefined : getCategoryMajor(category);

			updateParams({
				query: undefined,
				major: (major ?? params.major) as string,
				sub: category,
			});
		}
	};

	return (
		<main class={styles.container}>
			<div class={styles.intro}>
				<TypeWriter />
				<p>قائمة بشركات والمنتجات المطلوب مقاطعتها لدعم القضية الفلسطينية.</p>
				<SearchInput onSubmit={handleSubmit} value={params.query} />

				{error() && (
					<p class="error">
						حدث خطأ في تحميل البيانات. تأكد من اتصالك بالإنترنت وأن المتصفح
						الخاص بك لا يمنع الإتصال بمواقع جووجل.
					</p>
				)}
			</div>
			<section>
				{categories() && categories().length > 0 ? (
					<Filters
						categories={categories()}
						handleMajorCategoryChange={handleMajorCategoryChange}
						handleSubCategoryChange={handleSubCategoryChange}
					/>
				) : null}

				{results() ? (
					<Table
						products={results()}
						categories={categories()}
						total={total()}
						showProof={showProof}
						handleMajorCategoryChange={handleMajorCategoryChange}
						handleSubCategoryChange={handleSubCategoryChange}
					/>
				) : (
					<p>Loading</p>
				)}

				<div class={styles.footer}>
					{hasMore() ? (
						<Button onClick={showMore} class={styles.showMore}>
							{t("table.showMore")}
						</Button>
					) : (
						<p>{t("table.end")}</p>
					)}
				</div>

				<ProductModal />
			</section>

			<section class={styles.ack}>
				<A href="/acknowledgments">{t("footer.ack")}</A>
			</section>
		</main>
	);
}

export default App;
