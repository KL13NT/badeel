import { SetParams, useSearchParams } from "@solidjs/router";
import { Filter, SortOption, View } from "~types";

const parse = (param: string) => {
	try {
		return JSON.parse(param);
	} catch (error) {
		return [];
	}
};

export const useSearchQuery = () => {
	const [params, setParams] = useSearchParams();

	const updateParams = (update: SetParams) => {
		setParams(
			{
				...params,
				...update,
			},
			{
				replace: true,
			}
		);
	};

	const sub = () => (params.sub ? (parse(params.sub) as string[]) : []);

	const status = () =>
		params.status ? (parse(params.status) as Filter[]) : [];

	const page = () =>
		!Number.isNaN(Number(params.page)) ? Number(params.page) : 1;

	const major = () =>
		(params.major && params.major === "all") || !params.major
			? undefined
			: params.major;

	const query = () => params.query;

	const sort = () => (params.sort ?? "accuracy") as unknown as SortOption;

	const view = () => (params.view ?? "cards") as unknown as View;

	const productId = () => params.productId;

	return {
		params,
		major,
		sub,
		status,
		sort,
		view,
		query,
		page,
		productId,
		updateParams,
	};
};
