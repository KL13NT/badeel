import { createEffect, createSignal, onMount } from "solid-js";
import {
	ALTERNATIVES_URL,
	BOYCOTT_URL,
	UNSURE_URL,
} from "~constants/documents";
import { BaseProduct, Product, Status } from "~types";
import { mapRequestToParsedCSV } from "~utils/responses";
import Fuse, { FuseResult } from "fuse.js";
import { useFilterStore } from "~stores/filter";
import { useSearchQuery } from "./useSearchQuery";

let productFuse: null | Fuse<Product> = null;

export const useDocuments = () => {
	const { query } = useSearchQuery();
	const [fuseRef, setFuseRef] = createSignal<null | Fuse<Product>>(productFuse);
	const [filters] = useFilterStore;
	const [results, setResults] = createSignal<FuseResult<Product>[]>([]);

	const search = (query: string) => {
		if (!productFuse) {
			setResults([]);
			return;
		}

		const found = productFuse.search(query);

		if (filters.selected.key !== "all") {
			const filtered = found
				.filter((result) => result.item.status === filters.selected.key)
				.slice(0, 10);

			setResults(filtered);
			return;
		}

		setResults(found.slice(0, 10));
	};

	onMount(async () => {
		const [boycotted, alternatives, unsure] = await Promise.all([
			mapRequestToParsedCSV<BaseProduct[]>(fetch(BOYCOTT_URL)),
			mapRequestToParsedCSV<BaseProduct[]>(fetch(ALTERNATIVES_URL)),
			mapRequestToParsedCSV<BaseProduct[]>(fetch(UNSURE_URL)),
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

		setFuseRef(productFuse);
	});

	createEffect(() => {
		if (query && fuseRef() && filters) {
			search(query);
		}
	});

	return {
		fuse: productFuse,
		results,
		search,
	};
};
