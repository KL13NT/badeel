import styles from "./EmptySearchResult.module.scss";

export default function EmptySearchResult() {
	return <p class={styles.emptyMessage}>لا بوجد منتج او شركة بهذا الاسم </p>;
}
