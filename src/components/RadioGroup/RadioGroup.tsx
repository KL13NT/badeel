import { For, createEffect, createSignal, splitProps } from "solid-js";

import styles from "./RadioGroup.module.scss";

type Item = {
	label: string;
	value: string;
};

interface Props {
	id: string;
	items: Item[];
	name: string;
	label: string;
	checked: string;
}

export default function RadioGroup(_props: Props) {
	const [local, props] = splitProps(_props, [
		"items",
		"name",
		"label",
		"checked",
		"id",
	]);

	const [value, setValue] = createSignal<string | null>();

	const handleChange = (ev: Event) => {
		const target = ev.currentTarget as HTMLInputElement;

		if (target.checked) {
			setValue(target.value);
		}
	};

	createEffect(() => {
		setValue(local.checked);
	});

	return (
		<fieldset class={styles.group} id={local.id} {...props}>
			<p>{local.label}</p>

			<div class={styles.options}>
				<For each={local.items}>
					{(item) => (
						<label class={styles.radio}>
							<input
								type="radio"
								name={local.name}
								value={item.value}
								checked={value() === item.value}
								onChange={handleChange}
							/>

							<span class={styles.checkmark} />

							{item.label}
						</label>
					)}
				</For>
			</div>
		</fieldset>
	);
}
