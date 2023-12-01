import { batch, createMemo, createSignal, onMount } from "solid-js";
import {
	ALTERNATIVES_URL,
	BOYCOTT_URL,
	CATEGORIES_URL,
	UNSURE_URL,
} from "~constants/documents";
import { BaseProduct, Category, Product, Status } from "~types";
import { mapRequestToParsedCSV } from "~utils/responses";
import Fuse, { FuseResult } from "fuse.js";
import { useSearchQuery } from "./useSearchQuery";
import { generateCategoryMap } from "~utils/categories";
import { filterProducts, filterResults } from "~utils/filters";

let productFuse: null | Fuse<Product> = null;
const itemsPerPage = 50;

export const useDocuments = () => {
	const { params, updateParams } = useSearchQuery();
	const [page, setPage] = createSignal(1);
	const [results, setResults] = createSignal<FuseResult<Product>[]>([]);
	const [fuseRef, setFuseRef] = createSignal<Fuse<Product> | null>(null);
	const [categories, setCategories] = createSignal<Category[]>([]);
	const [error, setError] = createSignal(false);

	const search = (query?: string) => {
		const actual = query ?? params.query ?? "";

		if (!productFuse) {
			batch(() => {
				setResults([]);
				updateParams({
					query: actual,
					major: undefined,
					sub: undefined,
				});
			});
			return;
		}

		const found = productFuse.search(actual);

		batch(() => {
			updateParams({
				query: actual,
				major: undefined,
				sub: undefined,
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

			const data = boycotted
				.map((product) => ({
					...product,
					status: "boycott" as Status,
				}))
				.concat(
					alternatives.map((product) => ({
						...product,
						status: "alternative" as Status,
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
			});

			if (params.query) {
				search(params.query);
			}
		} catch (error) {
			setError(true);
		}
	});

	const filtered = createMemo(() => {
		if (results() && params.query && params.query !== "") {
			return filterResults(
				results()!,
				params.status,
				params.major,
				params.sub
			).map((product) => product.item);
		}

		const docs = fuseRef()?.getIndex()?.docs ?? [];

		return filterProducts(docs, params.status, params.major, params.sub);
	});

	const showMore = () => {
		setPage(page() + 1);
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
	};
};
