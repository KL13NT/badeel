import { JSX } from "solid-js/jsx-runtime";
import Skeleton from "~components/Skeleton/Skeleton";

import styles from "./Table.module.scss";

interface Props {
	children: JSX.Element;
}

export default function TableRow(props: Props) {
	return <tr>{props.children}</tr>;
}

export function TableRowSkeleton() {
	return <Skeleton class={styles.tableRowSkeleton} as="tr" />;
}
