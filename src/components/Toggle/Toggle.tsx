import { JSX, createEffect, createSignal, splitProps } from "solid-js";
import clsx from "clsx";

import Button from "~components/Button/Button";

import styles from "./Toggle.module.scss";

type ButtonProps = Omit<
	JSX.ButtonHTMLAttributes<HTMLButtonElement>,
	"onChange"
>;

interface Props extends ButtonProps {
	children: JSX.Element;
	label: string;
	class?: string;
	onChange: (updated: boolean, event: MouseEvent) => unknown;
	pressed?: boolean;
	allowDisable?: false;
}

export default function Toggle(_props: Props) {
	const [props, rest] = splitProps(_props, [
		"children",
		"class",
		"pressed",
		"class",
		"label",
		"onChange",
		"allowDisable",
	]);
	const [pressed, setPressed] = createSignal(false);

	const toggle = (ev: MouseEvent) => {
		const updated = !pressed();

		if (!props.allowDisable && !updated) {
			return;
		}

		setPressed(updated);
		props.onChange(updated, ev);
	};

	createEffect(() => {
		if (typeof props.pressed === "undefined") return;

		setPressed(props.pressed);
	});

	return (
		<Button
			class={clsx("t-body", styles.toggle, props.class)}
			onClick={toggle}
			aria-pressed={pressed()}
			aria-label={`Toggle ${props.label}`}
			{...rest}
		>
			{props.children}
		</Button>
	);
}
