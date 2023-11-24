import { createStore } from "solid-js/store";
import { Product } from "~types";

interface ProductModalStore {
	product: Product | null;
}

// eslint-disable-next-line solid/reactivity
const productModalStore = createStore<ProductModalStore>({
	product: null,
});

export const useProductModal = () => productModalStore;
