import { Show, createEffect, createSignal, onMount } from "solid-js";
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
import { toggleOverlay } from "~stores/overlay";

let searchThrottleTimeout: number | NodeJS.Timeout = 0;
let searchInputContainerRef: HTMLDivElement;

function App() {
	const {
		major,
		sub,
		status,
		query,
		sort,
		productId,
		view,
		params,
		updateParams,
	} = useSearchQuery();
	const {
		search,
		getSuggestions,
		results,
		all,
		categories,
		loading,
		error,
		total,
		page,
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
		toggleOverlay("product-modal", true);
	};

	const openFilters = () => {
		setFiltersOpen(true);
		toggleOverlay("filters-modal", true);
	};

	const closeFilters = () => {
		setFiltersOpen(false);
		toggleOverlay("filters-modal", false);
	};

	const closeProductModal = () => {
		setFocusedProduct(null);
		toggleOverlay("product-modal", false);

		updateParams({
			productId:
				undefined /* To make sure productId is cleared after sharing */,
		});
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

	createEffect(() => {
		if (!productId()) return;

		const product = all().find((product) => product.id === productId());
		if (!product) return;

		setFocusedProduct(product);
	});

	const showAlternatives = (product: Product) => {
		const major = getCategoryMajor(product.Category);

		updateParams({
			...params,
			query: undefined,
			sub: JSON.stringify([product.Category]),
			major: major.english,
			status: JSON.stringify(["alternative"]),
			page: 1,
		});
	};

	onMount(async () => {
		if (query()) {
			search(query());
		}
	});

	return (
		<section class={styles.container}>
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
			</div>

			<Transition name="filter-slide-right">
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
					<FilterIcon role="presentation" />
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
							<CardsToggleIcon role="presentation" />
						</Toggle>
						<Toggle
							class={styles.toggle}
							label={t("view.table")}
							onChange={() => switchView("table")}
							pressed={view() === "table"}
						>
							<TableToggleIcon role="presentation" />
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

			<article class={styles.table}>
				<Transition name="slide-fade">
					<Show when={view() === "table"}>
						<Transition name="enter-slide-exit-fade">
							<Show when={results() && !loading()} fallback={<TableSkeleton />}>
								<Table
									products={results()}
									showProof={showProof}
									handleSubCategoryChange={handleSubCategoryChange}
								/>
							</Show>
						</Transition>
					</Show>
				</Transition>

				<Transition name="slide-fade">
					<Show when={view() === "cards"}>
						<Transition name="enter-slide-exit-fade">
							<Show
								when={results() && !loading()}
								fallback={<ResultCardsSkeleton />}
							>
								<ResultCards
									products={results()}
									showProof={showProof}
									showAlternatives={showAlternatives}
									handleSubCategoryChange={handleSubCategoryChange}
								/>
							</Show>
						</Transition>
					</Show>
				</Transition>

				<div class={styles.footer}>
					{hasMore() && (
						<Button onClick={showMore} class={styles.showMore}>
							{t("table.showMore")}
						</Button>
					)}

					{total() > 0 && !hasMore() && page() > 1 && <p>{t("table.end")}</p>}

					{total() === 0 && <p>{t("table.noMatching")}</p>}
				</div>

				<Transition name="slide-fade">
					<Show when={focusedProduct()}>
						<ProductModal
							product={focusedProduct()!}
							close={closeProductModal}
							showAlternatives={showAlternatives}
						/>
					</Show>
				</Transition>
			</article>

			<article class={styles.ack}>
				<A href="/acknowledgments">{t("footer.ack")}</A>
			</article>
		</section>
	);
}

export default App;
