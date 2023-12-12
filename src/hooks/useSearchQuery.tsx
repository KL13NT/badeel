import { SetParams, useSearchParams } from "@solidjs/router";
import { Filter } from "~types";

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

	return {
		params,
		major,
		sub,
		status,
		query,
		page,
		updateParams,
	};
};
