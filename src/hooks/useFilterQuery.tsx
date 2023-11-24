import { useSearchParams } from "@solidjs/router";
import { Filter } from "~types";

interface Params {
	[key: string]: string;
	status: Filter;
}

export const useFilterQuery = () => {
	const [params, setParams] = useSearchParams<Params>();

	const updateStatus = (status: string) => {
		setParams({
			...params,
			status: status,
		});
	};

	return {
		status: params.status,
		updateStatus,
	};
};
