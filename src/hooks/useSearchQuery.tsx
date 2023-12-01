import { useSearchParams } from "@solidjs/router";
import { Category, Filter } from "~types";

interface Params {
	query?: string;
	status?: Filter;
	major?: Category["english"];
	sub?: Category["english"];
}

export const useSearchQuery = () => {
	const [params, setParams] = useSearchParams();

	const updateParams = (update: Partial<Params>) => {
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

	return {
		params: params as Params,
		updateParams,
	};
};
