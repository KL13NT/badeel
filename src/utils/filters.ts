import { FuseResult } from "fuse.js";
import { Filter, Product } from "~types";
import { getSubCategories } from "./categories";

export const filterProducts = (
	products: Product[],
	filter: Filter,
	major?: string,
	sub?: string
) => {
	let final = products;

	if (filter && filter !== "all") {
		final = final.filter((product) => product.status === filter);
	}

	if (sub && sub !== "all") {
		final = final.filter((product) => product.Category === sub);
	}

	if (major && major !== "all" && (!sub || sub === "all")) {
		const subCategoriesKeys = getSubCategories(major).map(
			(category) => category.english
		);

		return final.filter((product) =>
			subCategoriesKeys.includes(product.Category)
		);
	}

	return final;
};

export const filterResults = (
	results: FuseResult<Product>[],
	filter: Filter,
	major?: string,
	sub?: string
) => {
	let final = results;

	if (filter && filter !== "all") {
		final = final.filter((result) => result.item.status === filter);
	}

	if (sub && sub !== "all") {
		final = final.filter(
			(result) => result.item.status === filter && result.item.Category === sub
		);
	}

	if (major && major !== "all" && (!sub || sub === "all")) {
		const subCategoriesKeys = getSubCategories(major).map(
			(category) => category.english
		);

		return final.filter((result) =>
			subCategoriesKeys.includes(result.item.Category)
		);
	}

	return final;
};
