import { batch, createMemo, createSignal, onMount } from "solid-js";
import {
	ALTERNATIVES_URL,
	BOYCOTT_URL,
	CATEGORIES_URL,
	UNSURE_URL,
} from "~constants/documents";
import {
	BaseProduct,
	Category,
	FuseIndex,
	Product,
	SortOption,
	Status,
} from "~types";
import { mapRequestToParsedCSV } from "~utils/responses";
import Fuse, { FuseResult } from "fuse.js";
import { useSearchQuery } from "./useSearchQuery";
import { generateCategoryMap } from "~utils/categories";
import { filterProducts, filterResults } from "~utils/filters";

let productFuse: null | Fuse<Product> = null;
const itemsPerPage = 20;

const sortKeyLocaleMap: Record<Exclude<SortOption, "accuracy">, string> = {
	Name: "ar-EG",
	status: "en-GB",
	Category: "en-GB",
	"English Name": "en-GB",
};

const sortProducts = (products: Product[], sort: SortOption) => {
	if (sort === "accuracy") {
		return products;
	}

	return [...products].sort((a, b) =>
		a[sort]
			.trim()
			.localeCompare(b[sort].trim(), sortKeyLocaleMap[sort] ?? "en-GB")
	);
};

export const useDocuments = () => {
	const { params, major, status, sub, page, sort, updateParams } =
		useSearchQuery();
	const [results, setResults] = createSignal<FuseResult<Product>[]>([]);
	const [fuseRef, setFuseRef] = createSignal<Fuse<Product> | null>(null);
	const [categories, setCategories] = createSignal<Category[]>([]);
	const [error, setError] = createSignal(false);
	const [loading, setLoading] = createSignal(true);

	const search = (query?: string) => {
		const actual = query ?? params.query ?? "";

		if (!productFuse) {
			batch(() => {
				setResults([]);
				updateParams({
					query: actual,
					major: undefined,
					sub: undefined,
					page: 1,
				});
			});
			return;
		}

		const found = productFuse.search(actual, {
			limit: 10,
		});

		batch(() => {
			updateParams({
				...params,
				query: actual,
				page: 1,
				sort: "accuracy",
			});
			setResults(found);
		});
	};

	onMount(async () => {
		try {
			const [boycotted, alternatives, unsure, categories] = await Promise.all([
				mapRequestToParsedCSV<BaseProduct[]>(fetch(BOYCOTT_URL)),
				mapRequestToParsedCSV<BaseProduct[]>(fetch(ALTERNATIVES_URL)),
				mapRequestToParsedCSV<BaseProduct[]>(fetch(UNSURE_URL)),
				mapRequestToParsedCSV<Category[]>(fetch(CATEGORIES_URL)),
			]);

			const data = alternatives
				.map((product) => ({
					...product,
					status: "alternative" as Status,
				}))
				.concat(
					boycotted.map((product) => ({
						...product,
						status: "boycott" as Status,
					}))
				)
				.concat(
					unsure.map((product, index) => ({
						...product,
						status: "unsure" as Status,
						ref: index + 2,
					}))
				);

			productFuse = new Fuse<Product>(data as Product[], {
				keys: ["Name", "English Name", "Manufacturer"],
				includeScore: true,
				findAllMatches: false,
			});

			generateCategoryMap(categories);
			batch(() => {
				setCategories(categories);
				setFuseRef(productFuse);
				setLoading(false);
			});

			if (params.query) {
				search(params.query);
			}
		} catch (error) {
			batch(() => {
				setError(true);
				setLoading(false);
			});
		}
	});

	const filtered = createMemo(() => {
		if (results() && params.query && params.query !== "") {
			return sortProducts(
				filterResults(results()!, status(), major(), sub()).map(
					(product) => product.item
				),
				sort()
			);
		}

		const index = fuseRef()?.getIndex() as unknown as FuseIndex;
		const docs = index?.docs ?? [];

		return sortProducts(filterProducts(docs, status(), major(), sub()), sort());
	});

	const showMore = () => {
		updateParams({
			page: page() + 1,
		});
	};

	const hasMore = () => filtered().length > page() * itemsPerPage;
	const paginated = () => filtered().slice(0, page() * itemsPerPage);
	const total = () => filtered().length;

	return {
		fuse: fuseRef,
		results: paginated,
		search,
		categories,
		error,
		showMore,
		hasMore,
		total,
		loading,
	};
};
