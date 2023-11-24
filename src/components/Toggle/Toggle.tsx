import { JSX, createEffect, createSignal } from "solid-js";
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
	onChange: (updated: boolean) => unknown;
	pressed?: boolean;
}

export default function Toggle(props: Props) {
	const [pressed, setPressed] = createSignal(false);

	const toggle = () => {
		const updated = !pressed();

		setPressed(updated);
		props.onChange(updated);
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
		>
			{props.children}
		</Button>
	);
}
