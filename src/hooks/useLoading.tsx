import { createSignal } from "solid-js";

export const useLoading = () => {
	const [state, setState] = createSignal<{
		status: "idle" | "submitting" | "error" | "submitted";
		context?: string;
	}>({
		status: "idle",
	});

	return {
		loadingState: state,
		setLoadingState: setState,
	};
};
