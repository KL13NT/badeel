import { FuseResult } from "fuse.js";
import { Filter, Product } from "~types";
import { getSubCategories } from "./categories";
import { arrayExists } from "./common";

export const filterProducts = (
	products: Product[],
	filter: Filter[] = [],
	major?: string,
	sub: string[] = []
) => {
	let final = products;

	if (arrayExists(filter)) {
		final = final.filter((result) => filter.includes(result.status));
	}

	if (arrayExists(sub)) {
		final = final.filter((result) => sub.includes(result.Category));
	}

	if (major && (!sub || sub.length === 0)) {
		const subCategoriesKeys = getSubCategories(major).map(
			(category) => category.english
		);

		return final.filter((result) =>
			subCategoriesKeys.includes(result.Category)
		);
	}

	return final;
};

/**
 * The reason there are two methods to filter here is because we can have
 * hundreds of
 */
export const filterResults = (
	results: FuseResult<Product>[],
	filter: Filter[] = [],
	major?: string,
	sub: string[] = []
) => {
	let final = results;

	if (arrayExists(filter)) {
		final = final.filter((result) => filter.includes(result.item.status));
	}

	if (arrayExists(sub)) {
		final = final.filter((result) => sub.includes(result.item.Category));
	}

	if (major && !sub) {
		const subCategoriesKeys = getSubCategories(major).map(
			(category) => category.english
		);

		return final.filter((result) =>
			subCategoriesKeys.includes(result.item.Category)
		);
	}

	return final;
};
