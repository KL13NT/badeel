import { Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { Transition } from "solid-transition-group";

import TypeWriter from "~components/TypeWriter/TypeWriter";
import SearchInput from "~components/SearchInput/SearchInput";
import ProductModal from "~components/ProductModal/ProductModal";
import Table, { TableSkeleton } from "~components/Table/Table";
import Button from "~components/Button/Button";
import FiltersModal from "~components/FiltersModal/FiltersModal";
import ActiveFilters from "~components/ActiveFilters/ActiveFilters";

import t from "~utils/messages";
import { arrayExists } from "~utils/common";
import { getCategoryMajor } from "~utils/categories";
import { useDocuments } from "~hooks/useDocuments";
import { useSearchQuery } from "~hooks/useSearchQuery";
import { useProductModal } from "~stores/product-modal";

import { Product } from "~types";

import styles from "./index.module.scss";

import FilterIcon from "~assets/icons/filter.svg?component-solid";

let searchThrottleTimeout: number | number = 0;

function App() {
	const { params, sub, status, updateParams } = useSearchQuery();
	const {
		search,
		results,
		categories,
		error,
		loading,
		total,
		hasMore,
		showMore,
	} = useDocuments();
	const [productModal, setProductModal] = useProductModal();
	const [filtersOpen, setFiltersOpen] = createSignal(false);

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

	const openFilters = () => {
		setFiltersOpen(true);
	};

	const closeFilters = () => {
		setFiltersOpen(false);
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
		} else {
			updateParams({
				query: undefined,
				major: undefined,
				sub: undefined,
			});
		}
	};

	const handleSubCategoryChange = (enabled: boolean, ev: MouseEvent) => {
		const target = ev.target as HTMLButtonElement;
		const category = target.dataset.category!;
		const major = category === "all" ? undefined : getCategoryMajor(category);
		if (enabled) {
			updateParams({
				query: undefined,
				major: (major?.english ?? params.major) as string,
				sub: category,
			});
		} else {
			updateParams({
				query: undefined,
				major: (major?.english ?? params.major) as string,
				sub: undefined,
			});
		}
	};

	const filtersCount = () => {
		const total = sub().length + status().length;

		if (params.major) return total + 1;

		return total;
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

				{total() === 0 && params.query && (
					<p class="error">لم نعثُر على هذا المنتج.</p>
				)}
			</div>

			<Transition name="slide-right">
				<Show when={filtersOpen()}>
					<FiltersModal categories={categories()} close={closeFilters} />
				</Show>
			</Transition>

			<div class={styles.filters}>
				<Button
					variant="action-invert"
					onClick={openFilters}
					data-active={
						arrayExists(sub()) || arrayExists(status()) || params.major
					}
				>
					<FilterIcon />
					{t("filters.activator")}
					{filtersCount() > 0 ? (
						<span class={styles.filterCount}>{filtersCount()}</span>
					) : null}
				</Button>
			</div>

			<ActiveFilters
				categories={categories()}
				openFilters={openFilters}
				total={total()}
				current={results().length}
			/>

			<section>
				{results() && !loading() ? (
					<Table
						products={results()}
						categories={categories()}
						total={total()}
						showProof={showProof}
						handleMajorCategoryChange={handleMajorCategoryChange}
						handleSubCategoryChange={handleSubCategoryChange}
					/>
				) : (
					<TableSkeleton />
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
				<A href="/why">{t("footer.why")}</A>
			</section>

			<Show when={productModal.product || filtersOpen()}>
				<div class={styles.overlay} />
			</Show>
		</main>
	);
}

export default App;
