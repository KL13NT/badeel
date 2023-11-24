import { createStore } from "solid-js/store";
import { STATUS_FILTER_OPTIONS } from "~constants/filters";

// eslint-disable-next-line solid/reactivity
export const useFilterStore = createStore({
	selected: STATUS_FILTER_OPTIONS.find((option) => option.key === "all")!,
	options: STATUS_FILTER_OPTIONS,
});
