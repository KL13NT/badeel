import { useSearchParams } from "@solidjs/router";
import { Filter } from "~types";

interface Params {
	[key: string]: string;
	query: string;
	status: Filter;
}

export const useSearchQuery = () => {
	const [params, setParams] = useSearchParams<Params>();

	const updateQuery = (query: string) => {
		setParams(
			{
				...params,
				query: query,
			},
			{
				replace: true,
			}
		);
	};

	const updateFilter = (status: Filter) => {
		setParams(
			{
				...params,
				status,
			},
			{
				replace: true,
			}
		);
	};

	return {
		params,
		updateQuery,
		updateFilter,
	};
};
