import clsx from "clsx";
import { JSX } from "solid-js/jsx-runtime";
import { mergeProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import styles from "./Skeleton.module.scss";

interface Props {
	class?: string;
	as?: keyof JSX.HTMLElementTags;
}

export default function Skeleton(_props: Props) {
	const props = mergeProps({ as: "div" }, _props);

	return (
		<Dynamic component={props.as} class={clsx(styles.skeleton, props.class)} />
	);
}
