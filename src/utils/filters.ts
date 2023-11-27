import { FuseResult } from "fuse.js";
import { Filter, Product } from "~types";

export const filterProducts = (products: Product[], filter: Filter) => {
	if (filter === "all") return products;

	return products.filter((product) => product.status === filter);
};

export const filterResults = (
	results: FuseResult<Product>[],
	filter: Filter
) => {
	if (filter === "all") return results;

	return results.filter((result) => result.item.status === filter);
};
