import clsx from "clsx";
import { Component, JSX, mergeProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Status } from "~types";

import styles from "./Badge.module.scss";

import ForbiddenIcon from "~assets/icons/forbidden.svg?component-solid";
import OliveIcon from "~assets/icons/olive.svg?component-solid";
import IncognitoIcon from "~assets/icons/incognito.svg?component-solid";

const statusIconMapping = {
	alternative: OliveIcon,
	boycott: ForbiddenIcon,
	unsure: IncognitoIcon,
} satisfies Record<Status, Component>;

interface Props {
	/**
	 * Text content
	 */
	children: JSX.Element;
	/**
	 * SVG-component import
	 */
	icon?: Component;

	variant: Status;
}

export default function Badge(_props: Props) {
	const props = mergeProps({ variant: "boycott" } as Props, _props);

	return (
		<span class={clsx("t-button", styles.badge, styles[props.variant])}>
			<Dynamic
				component={statusIconMapping[props.variant]}
				role="presentation"
			/>
			{props.children}
		</span>
	);
}
