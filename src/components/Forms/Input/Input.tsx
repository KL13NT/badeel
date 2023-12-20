import { JSX, mergeProps, splitProps } from "solid-js";

import styles from "./Input.module.scss";
import { Dynamic } from "solid-js/web";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	as?: "input" | "textarea";
}

export default function Input(_props: InputProps) {
	const props = mergeProps({ as: "input" }, _props);
	const [local, rest] = splitProps(props, ["label", "as"]);

	return (
		<label class={styles.input}>
			{local.label}

			<Dynamic component={local.as} {...rest} />
		</label>
	);
}
