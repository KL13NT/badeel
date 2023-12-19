import { JSX, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import clsx from "clsx";

import styles from "./Button.module.scss";

type AnchorProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

interface Props extends JSX.AriaAttributes {
	class?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	as?: keyof JSX.HTMLElementTags | ((props: any) => JSX.Element);
	children: JSX.Element;
	href?: AnchorProps["href"];
	target?: AnchorProps["target"];
	onClick?: ButtonProps["onClick"];
	tabIndex?: AnchorProps["tabIndex"];
	variant?: "default" | "danger" | "action" | "action-invert";
	type?: ButtonProps["type"];
	id?: ButtonProps["id"];
	disabled?: boolean;
}

export default function Button(_props: Props) {
	const props = mergeProps({ as: "button", variant: "default" }, _props);
	const [local, rest] = splitProps(props, [
		"children",
		"class",
		"as",
		"variant",
	]);

	return (
		<Dynamic
			component={local.as}
			class={clsx("t-body", styles.button, styles[local.variant], local.class)}
			{...(rest as JSX.HTMLAttributes<HTMLElement>)}
		>
			{local.children}
		</Dynamic>
	);
}
