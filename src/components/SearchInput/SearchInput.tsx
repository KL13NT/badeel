// TODO: fix obsolete results
// fix transition when results + blur

import { createMemo, createSignal, For, Show } from "solid-js";
import clsx from "clsx";

import Button from "~components/Button/Button";

import styles from "./SearchInput.module.scss";

import SearchIcon from "~assets/icons/magnifying-glass.svg?component-solid";

import { Product } from "~types";
import { Transition } from "solid-transition-group";
import { FuseResult, RangeTuple } from "fuse.js";
import { useSearchQuery } from "~hooks/useSearchQuery";
import { arabicLettersRegex } from "~constants/submit";

interface Props {
	onSubmit: (query: string, shouldClearFilters?: boolean) => unknown;
	onSuggest: (query: string) => FuseResult<Product>[];
	value?: string;
}

interface FormattedResultTextProps {
	inputString: string;
	matchIndices: ReadonlyArray<RangeTuple>;
}

function FormattedResultText(props: FormattedResultTextProps) {
	let currentIndex = 0;

	return (
		<>
			{props.matchIndices.map((matchIndex) => {
				const start = matchIndex[0];
				const end = matchIndex[1];

				const result = (
					<>
						<span>{props.inputString.substring(currentIndex, start)}</span>
						<b>{props.inputString.substring(start, end + 1)}</b>
					</>
				);

				currentIndex = end + 1;

				return result;
			})}

			<span>{props.inputString.substring(currentIndex)}</span>
		</>
	);
}

export default function SearchInput(props: Props) {
	const { query: searchQuery } = useSearchQuery();
	const [query, setQuery] = createSignal(searchQuery() ?? "");

	const handleSubmit = (ev: SubmitEvent) => {
		ev.preventDefault();
		const data = new FormData(ev.currentTarget as HTMLFormElement);

		props.onSubmit(data.get("query") as string);
	};

	const handleResultClick = (query: string) => {
		props.onSubmit(query, true);
	};

	const handleKeyDown = (ev: KeyboardEvent & { target: Element }) => {
		const target = ev.target;

		if (target.nodeName.toLowerCase() !== "button") {
			return;
		}

		if (["ArrowUp", "ArrowDown"].includes(ev.key)) {
			ev.preventDefault();
			ev.stopPropagation();
		}

		if (ev.key === "ArrowUp" && ev.target.previousElementSibling) {
			(ev.target.previousElementSibling as HTMLButtonElement).focus();
		} else if (ev.key === "ArrowDown" && ev.target.nextElementSibling) {
			(ev.target.nextElementSibling as HTMLButtonElement).focus();
		}
	};

	const results = createMemo(() => {
		if (query() && query().length > 0) {
			return props.onSuggest(query());
		} else return [];
	});

	const language = () =>
		query().length > 0 && arabicLettersRegex.test(query()) ? "ar" : "en";

	return (
		<div class={styles.wrapper}>
			<form
				onSubmit={handleSubmit}
				class={styles.search}
				data-active={query().length > 0 && results().length > 0}
				onKeyDown={handleKeyDown}
			>
				<div>
					<div class={styles.content}>
						<SearchIcon />
						<input
							type="text"
							name="query"
							placeholder="إبحث عن منتج أو شركة..."
							class={clsx("t-body", styles.input)}
							value={props.value ?? ""}
							onInput={(ev) => setQuery(ev.currentTarget.value)}
							autocomplete="off"
						/>
					</div>
					<Button
						type="submit"
						class={styles.submit}
						variant="action"
						disabled={query().length === 0}
					>
						إبحث
					</Button>
				</div>

				<Transition name="slide-fade">
					<Show when={query().length > 0 && results().length > 0}>
						<div class={styles.results} data-language={language()}>
							<For each={results()}>
								{(product) => {
									const name = product.matches![0].value!;

									return (
										<button
											dir="auto"
											class={styles.result}
											onClick={[handleResultClick, name]}
											type="button"
										>
											{arabicLettersRegex.test(name) ? (
												name
											) : (
												<FormattedResultText
													inputString={name}
													matchIndices={product.matches![0].indices}
												/>
											)}
										</button>
									);
								}}
							</For>
						</div>
					</Show>
				</Transition>
			</form>
			<div class={clsx("overlay", styles.overlay)} />
		</div>
	);
}
