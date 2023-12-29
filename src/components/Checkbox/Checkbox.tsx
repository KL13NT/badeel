import { JSX, splitProps } from "solid-js";

import styles from "./Checkbox.module.scss";

import CheckIcon from "~assets/icons/check.svg?component-solid";

interface Props {
	id: string;
	label: string;
	value: string;
	name: string;
	checked?: boolean;
	onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>;
}

export default function Checkbox(_props: Props) {
	const [local, props] = splitProps(_props, ["name", "value", "label"]);

	return (
		<label class={styles.checkbox}>
			<input type="checkbox" name={local.name} value={local.value} {...props} />

			<span class={styles.checkmark}>
				<CheckIcon role="presentation" />
			</span>

			{local.label}
		</label>
	);
}
