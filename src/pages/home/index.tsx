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
import ResultCards, {
	ResultCardsSkeleton,
} from "~components/ResultCards/ResultCards";
import Toggle from "~components/Toggle/Toggle";

import t from "~utils/messages";
import { arrayExists } from "~utils/common";
import { getCategoryMajor } from "~utils/categories";
import { useDocuments } from "~hooks/useDocuments";
import { useSearchQuery } from "~hooks/useSearchQuery";

import { Product, View } from "~types";

import styles from "./index.module.scss";

import FilterIcon from "~assets/icons/filter.svg?component-solid";

import CardsToggleIcon from "~assets/icons/cards-toggle.svg?component-solid";
import TableToggleIcon from "~assets/icons/table-toggle.svg?component-solid";

let searchThrottleTimeout: number | number = 0;
let searchInputContainerRef: HTMLDivElement;

function App() {
	const { major, sub, status, query, sort, view, updateParams } =
		useSearchQuery();
	const {
		search,
		getSuggestions,
		results,
		categories,
		error,
		loading,
		total,
		hasMore,
		showMore,
	} = useDocuments();
	const [focusedProduct, setFocusedProduct] = createSignal<Product | null>(
		null
	);
	const [filtersOpen, setFiltersOpen] = createSignal(false);

	const handleSearch = (query: string, shouldClearFilters = false) => {
		clearTimeout(searchThrottleTimeout);

		searchInputContainerRef.focus();
		searchInputContainerRef.scrollIntoView({
			behavior: "smooth",
		});

		searchThrottleTimeout = setTimeout(() => {
			search(query, shouldClearFilters);
		}, 250);
	};

	const showProof = (product: Product) => {
		setFocusedProduct(product);
	};

	const openFilters = () => {
		setFiltersOpen(true);
	};

	const closeFilters = () => {
		setFiltersOpen(false);
	};

	const closeProductModal = () => {
		setFocusedProduct(null);
	};

	const clearFilters = () => {
		updateParams({
			major: undefined,
			sub: undefined,
			query: undefined,
			status: undefined,
			sort: undefined,
			page: 1,
		});
	};

	const handleSubCategoryChange = (enabled: boolean, ev: MouseEvent) => {
		const target = ev.target as HTMLButtonElement;
		const category = target.dataset.category!;
		const parent = category === "all" ? undefined : getCategoryMajor(category);

		if (enabled) {
			updateParams({
				query: undefined,
				major: (parent?.english ?? major()) as string,
				sub: JSON.stringify([category]),
				page: 1,
			});
		} else {
			updateParams({
				query: undefined,
				major: (parent?.english ?? major()) as string,
				sub: undefined,
				page: 1,
			});
		}
	};

	const filtersCount = () => {
		let total = sub().length + status().length;

		if (major()) total += 1;
		if (query()) total += 1;
		if (sort() && sort() !== "accuracy") total += 1;

		return total;
	};

	const switchView = (view: View) => {
		updateParams({
			view,
		});
	};

	return (
		<main class={styles.container}>
			<Show when={focusedProduct() || filtersOpen()}>
				<div class="overlay" />
			</Show>

			<div class={styles.intro}>
				<TypeWriter />
				<p>قائمة بالمنتجات الداعمة للكيان الصهيوني والبدائل المحلية.</p>
				<div ref={searchInputContainerRef} tabIndex={-1}>
					<SearchInput
						onSubmit={handleSearch}
						onSuggest={getSuggestions}
						value={query()}
					/>
				</div>

				{error() && (
					<p class="error">
						حدث خطأ في تحميل البيانات. تأكد من اتصالك بالإنترنت وأن المتصفح
						الخاص بك لا يمنع الإتصال بمواقع جووجل.
					</p>
				)}

				{total() === 0 && query() && (
					<p class="error">لم نعثُر على هذا المنتج.</p>
				)}
			</div>

			<Transition name="slide-right">
				<Show when={filtersOpen() && !loading()}>
					<FiltersModal categories={categories()} close={closeFilters} />
				</Show>
			</Transition>

			<div class={styles.filters}>
				<Button
					variant="action-invert"
					class={styles.filter}
					onClick={openFilters}
					data-active={arrayExists(sub()) || arrayExists(status()) || major}
				>
					<FilterIcon />
					{t("filters.activator")}
					{filtersCount() > 0 ? (
						<span class={styles.filterCount}>{filtersCount()}</span>
					) : null}
				</Button>

				<div class={styles.left}>
					<Show when={filtersCount() > 0}>
						<button class={styles.clear} onClick={clearFilters}>
							{t("filters.clear")}
						</button>
					</Show>
					<div class={styles.separator} />
					<div class={styles.view}>
						<Toggle
							class={styles.toggle}
							label={t("view.cards")}
							onChange={() => switchView("cards")}
							pressed={view() === "cards"}
						>
							<CardsToggleIcon />
						</Toggle>
						<Toggle
							class={styles.toggle}
							label={t("view.table")}
							onChange={() => switchView("table")}
							pressed={view() === "table"}
						>
							<TableToggleIcon />
						</Toggle>
					</div>
				</div>
			</div>

			<ActiveFilters
				categories={categories()}
				openFilters={openFilters}
				sort={sort()}
				clear={clearFilters}
				active={filtersCount()}
				switchView={switchView}
				view={view()}
			/>

			<section class={styles.table}>
				<Transition name="slide-fade">
					<Show when={view() === "table"}>
						{results() && !loading() ? (
							<Table
								products={results()}
								showProof={showProof}
								handleSubCategoryChange={handleSubCategoryChange}
							/>
						) : (
							<TableSkeleton />
						)}
					</Show>
				</Transition>

				<Transition name="slide-fade">
					<Show when={view() === "cards"}>
						{results() && !loading() ? (
							<ResultCards
								products={results()}
								showProof={showProof}
								handleSubCategoryChange={handleSubCategoryChange}
							/>
						) : (
							<ResultCardsSkeleton />
						)}
					</Show>
				</Transition>

				<div class={styles.footer}>
					{hasMore() ? (
						<Button onClick={showMore} class={styles.showMore}>
							{t("table.showMore")}
						</Button>
					) : (
						<p>{t("table.end")}</p>
					)}
				</div>

				<Transition name="slide-fade">
					<Show when={focusedProduct()}>
						<ProductModal
							product={focusedProduct()!}
							close={closeProductModal}
						/>
					</Show>
				</Transition>
			</section>

			<section class={styles.ack}>
				<A href="/acknowledgments">{t("footer.ack")}</A>
			</section>
		</main>
	);
}

export default App;
