import TypeWriter from "~components/TypeWriter/TypeWriter";
import SearchInput from "~components/SearchInput/SearchInput";

import { useDocuments } from "~hooks/useDocuments";
import { useSearchQuery } from "~hooks/useSearchQuery";

import { useProductModal } from "~stores/product-modal";

import { Product } from "~types";

import styles from "./index.module.scss";
import ProductModal from "~components/ProductModal/ProductModal";
import Table from "~components/Table/Table";

let searchThrottleTimeout: number | number = 0;

function App() {
	const { params } = useSearchQuery();
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

	return (
		<main class={styles.container}>
			<div class={styles.intro}>
				<TypeWriter />
				<p>قائمة بشركات والمنتجات المطلوب مقاطعتها لدعم القضية الفلسطينية.</p>
				<SearchInput onSubmit={handleSubmit} value={params.query} />
			</div>
			<section>
				<ProductModal />

				{results() ? (
					<Table
						products={results()}
						categories={categories()}
						showProof={showProof}
					/>
				) : (
					<p>Loading</p>
				)}
			</section>
		</main>
	);
}

export default App;
