import Button from "~components/Button/Button";

import styles from "./SearchInput.module.scss";
import clsx from "clsx";

import SearchIcon from "~assets/icons/magnifying-glass.svg?component-solid";

interface Props {
	onSubmit: (query: string) => unknown;
	value?: string;
}

export default function SearchInput(props: Props) {
	const handleSubmit = (ev: SubmitEvent) => {
		ev.preventDefault();
		const data = new FormData(ev.currentTarget as HTMLFormElement);

		props.onSubmit(data.get("query") as string);
	};

	return (
		<form onSubmit={handleSubmit} class={styles.search}>
			<div class={styles.content}>
				<SearchIcon />
				<input
					type="text"
					name="query"
					placeholder="إبحث عن اسم منتج أو شركة..."
					class={clsx("t-body", styles.input)}
					value={props.value ?? ""}
				/>
				<Button type="submit" class={styles.submit} variant="action">
					إبحث
				</Button>
			</div>
		</form>
	);
}
