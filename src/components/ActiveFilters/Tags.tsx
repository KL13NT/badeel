import { Show } from "solid-js";
import Button from "~components/Button/Button";

import { useSearchQuery } from "~hooks/useSearchQuery";
import t, { MessageKey } from "~utils/messages";
import { localizeNumber } from "~utils/common";
import { getCategoryByKey, getCategoryMajor } from "~utils/categories";
import { Category } from "~types";

import styles from "./Tags.module.scss";

import CloseIcon from "~assets/icons/x-2.svg?component-solid";

interface TagsProps {
	categories: Category[];
	openFilters: () => void;
}

export default function Tags(props: TagsProps) {
	const { sub, status, query, major, updateParams } = useSearchQuery();

	const handleClearFilter = (filter: string[]) => {
		const update: Record<string, undefined | number> = {
			page: 1,
		};

		filter.forEach((key) => {
			update[key] = undefined;
		});

		updateParams(update);
	};

	return (
		<>
			<Show when={query()}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="query"
					onClick={[handleClearFilter, ["query"]]}
				>
					<span>{t("filters.search")}: </span>
					{query()}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={status() && status().length > 0}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="status"
					onClick={[handleClearFilter, ["status"]]}
				>
					<span>{t("filters.status")}: </span>
					{status()
						.map((status) => t(`filters.${status}` as MessageKey))
						.join(", ")}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={major() && props.categories.length > 0}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="major"
					onClick={[handleClearFilter, ["major", "sub"]]}
				>
					{getCategoryByKey(major() as string).arabic}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={sub() && sub().length >= 1 && props.categories.length > 0}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="sub"
					onClick={() =>
						sub().length === 1
							? handleClearFilter(["sub"])
							: props.openFilters()
					}
				>
					<span>{getCategoryMajor(sub()[0]).arabic}: </span>
					{getCategoryByKey(sub()[0]).arabic}
					<CloseIcon />
				</Button>
			</Show>

			<Show when={sub().length > 1}>
				<Button
					variant="default"
					class={styles.filter}
					data-filter="sub"
					onClick={props.openFilters}
				>
					+{localizeNumber(sub().length - 1)}
				</Button>
			</Show>
		</>
	);
}
