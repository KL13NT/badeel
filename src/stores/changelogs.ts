import { createSignal } from "solid-js";

export const [changelogsSignal, setChangelogsSignal] = createSignal<
	string | null
>(null);
