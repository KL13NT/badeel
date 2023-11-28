import { useSearchParams } from "@solidjs/router";
import { Category, Filter } from "~types";

interface Params {
	[key: string]: string;
	query: string;
	status: Filter;
	major: Category["english"];
	sub: Category["english"];
}

export const useSearchQuery = () => {
	const [params, setParams] = useSearchParams<Params>();

	const updateQuery = (query: string) => {
		setParams(
			{
				...params,
				query: query,
				major: null,
				sub: null,
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

	const updateMajorCategory = (categoryKey: string) => {
		setParams(
			{
				...params,
				query: null,
				major: categoryKey,
				sub: null,
			},
			{
				replace: true,
			}
		);
	};

	const updateSubCategory = (categoryKey: string, major?: string) => {
		setParams(
			{
				...params,
				query: null,
				sub: categoryKey,
				major: major ?? params.major,
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
		updateMajorCategory,
		updateSubCategory,
	};
};
