import { batch, createMemo, createResource, createSignal } from "solid-js";
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

const generateProductHash = (product: Product) => {
	const string = Object.values(product).join("");

	let hash = 0;
	let i;
	let chr;

	for (i = 0; i < string.length; i++) {
		chr = string.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}

	return String(hash);
};

const [results, setResults] = createSignal<FuseResult<Product>[]>([]);
const [fuseRef, setFuseRef] = createSignal<Fuse<Product> | null>(null);
const [categories, setCategories] = createSignal<Category[]>([]);

const fetchDocuments = async () => {
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
			id: generateProductHash(product as Product),
		}))
		.concat(
			boycotted.map((product) => ({
				...product,
				status: "boycott" as Status,
				id: generateProductHash(product as Product),
			}))
		)
		.concat(
			unsure.map((product, index) => ({
				...product,
				status: "unsure" as Status,
				ref: index + 2,
				id: generateProductHash(product as Product),
			}))
		);

	generateCategoryMap(categories);

	productFuse = new Fuse<Product>(data as Product[], {
		keys: ["Name", "English Name", "Manufacturer"],
		includeScore: true,
		findAllMatches: false,
		includeMatches: true,
		isCaseSensitive: false,
	});

	batch(() => {
		setCategories(categories);
		setFuseRef(productFuse);
	});

	return data;
};

const resource = createResource(fetchDocuments, {
	initialValue: [],
});

export const useDocuments = () => {
	const { params, major, status, sub, page, sort, updateParams } =
		useSearchQuery();
	const [data] = resource;

	const search = (query?: string, shouldClearFilters = false) => {
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
			if (shouldClearFilters) {
				updateParams({
					...params,
					query: actual,
					page: 1,
					major: undefined,
					sub: undefined,
					status: undefined,
					sort: "accuracy",
				});
			} else {
				updateParams({
					...params,
					query: actual,
					page: 1,
					sort: "accuracy",
				});
			}
			setResults(found);
		});
	};

	const getSuggestions = (query: string) => {
		if (!productFuse) {
			return [];
		}

		const results = productFuse.search(query, {
			limit: 5,
		});

		return results.filter(
			(current, index, results) =>
				results.findIndex(
					(result) => result.matches![0].value === current.matches![0].value
				) === index
		);
	};

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

	const all = (): Product[] =>
		(fuseRef()?.getIndex() as unknown as FuseIndex)?.docs ?? [];

	const loading = () => data.loading;
	const error = () => data.error;
	const state = () => data.state;

	return {
		all,
		results: paginated,
		getSuggestions,
		search,
		categories,
		showMore,
		hasMore,
		total,
		loading,
		error,
		state,
	};
};
