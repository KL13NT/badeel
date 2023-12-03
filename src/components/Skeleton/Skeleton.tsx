import clsx from "clsx";
import { JSX } from "solid-js/jsx-runtime";
import { mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import styles from "./Skeleton.module.scss";

interface Props extends JSX.AriaAttributes {
	[key: string]: unknown;
	class?: string;
	as?: keyof JSX.HTMLElementTags;
	children?: JSX.Element;
}

export default function Skeleton(_props: Props) {
	const merged = mergeProps({ as: "div" }, _props);
	const [local, rest] = splitProps(merged, ["as", "class", "children"]);

	return (
		<Dynamic
			component={local.as}
			class={clsx(styles.skeleton, local.class)}
			{...rest}
		>
			{local.children}
		</Dynamic>
	);
}
