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

let searchThrottleTimeout: number | number = 0;

function App() {
	const { params, updateMajorCategory, updateSubCategory } = useSearchQuery();
	const { search, results, categories } = useDocuments();
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
			updateMajorCategory(category);
		}
	};

	const handleSubCategoryChange = (enabled: boolean, ev: MouseEvent) => {
		const target = ev.target as HTMLButtonElement;
		const category = target.dataset.category!;

		if (enabled) {
			const major = category === "all" ? undefined : getCategoryMajor(category);

			updateSubCategory(category, major?.english);
		}
	};

	return (
		<main class={styles.container}>
			<div class={styles.intro}>
				<TypeWriter />
				<p>قائمة بشركات والمنتجات المطلوب مقاطعتها لدعم القضية الفلسطينية.</p>
				<SearchInput onSubmit={handleSubmit} value={params.query} />
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
						showProof={showProof}
						handleMajorCategoryChange={handleMajorCategoryChange}
						handleSubCategoryChange={handleSubCategoryChange}
					/>
				) : (
					<p>Loading</p>
				)}

				<ProductModal />
			</section>
		</main>
	);
}

export default App;
