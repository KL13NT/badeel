import { batch, createSignal, onMount } from "solid-js";
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
import { filterResults } from "~utils/filters";

let productFuse: null | Fuse<Product> = null;

export const useDocuments = () => {
	const { params, updateQuery } = useSearchQuery();
	const [results, setResults] = createSignal<FuseResult<Product>[]>([]);
	const [fuseRef, setFuseRef] = createSignal<Fuse<Product> | null>(null);
	const [categories, setCategories] = createSignal<Category[]>([]);

	const search = (query?: string) => {
		const actual = query ?? params.query;

		if (!productFuse) {
			batch(() => {
				setResults([]);
				updateQuery(actual);
			});
			return;
		}

		const found = productFuse.search(actual);

		batch(() => {
			updateQuery(actual);
			setResults(found);
		});
	};

	onMount(async () => {
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
	});

	const filteredProducts = () =>
		results() && params.query
			? filterResults(results()!, params.status)
					.map((product) => product.item)
					.slice(0, 10)
			: fuseRef()?.getIndex().docs;

	return {
		fuse: fuseRef,
		results: filteredProducts,
		search,
		categories,
	};
};
