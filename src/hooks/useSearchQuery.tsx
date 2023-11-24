import { useSearchParams } from "@solidjs/router";

interface Params {
	[key: string]: string;
	q: string;
}

export const useSearchQuery = () => {
	const [params, setParams] = useSearchParams<Params>();

	const updateQuery = (query: string) => {
		setParams({
			...params,
			q: query,
		});
	};

	return {
		query: params.q,
		updateQuery,
	};
};
