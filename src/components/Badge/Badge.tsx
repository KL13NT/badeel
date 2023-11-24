import clsx from "clsx";
import { Component, JSX, mergeProps } from "solid-js";

import { Status } from "~types";

import styles from "./Badge.module.scss";

interface Props {
	/**
	 * Text content
	 */
	children: JSX.Element;
	/**
	 * SVG-component import
	 */
	icon?: Component;

	variant?: Status;
}

export default function Badge(_props: Props) {
	const props = mergeProps({ variant: "boycott" }, _props);

	return (
		<span class={clsx("t-button", styles.badge, styles[props.variant])}>
			{props.icon && <props.icon />}
			{props.children}
		</span>
	);
}
