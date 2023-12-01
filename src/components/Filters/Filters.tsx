import { For, createMemo } from "solid-js";
import Toggle from "~components/Toggle/Toggle";
import { useSearchQuery } from "~hooks/useSearchQuery";
import { Category } from "~types";

import ArrowIcon from "~assets/icons/arrow-down.svg?component-solid";

import styles from "./Filters.module.scss";
import t from "~utils/messages";
import Button from "~components/Button/Button";
import clsx from "clsx";

interface Props {
	categories: Category[];
	handleSubCategoryChange: (enabled: boolean, ev: MouseEvent) => unknown;
	handleMajorCategoryChange: (enabled: boolean, ev: MouseEvent) => unknown;
}

let majorSliderRef: HTMLDivElement;
let subSliderRef: HTMLDivElement;

export default function Filters(props: Props) {
	const { params } = useSearchQuery();

	const majorCategories = createMemo(() =>
		props.categories.filter(
			(category) => !category.major || category.major === ""
		)
	);

	const subCategories = createMemo(() =>
		props.categories.filter(
			(category) =>
				category.major &&
				category.major.length > 0 &&
				category.major === params.major
		)
	);

	const selectedMajor = () => params.major ?? "all";
	const selectedSub = () => params.sub ?? "all";

	const handleScroll = (slider: HTMLDivElement, ev: MouseEvent) => {
		if (!slider) return;

		const target = ev.target as HTMLDivElement;
		const direction = target.closest("button")!.dataset.direction!;

		if (direction === "left") {
			slider!.scrollBy(200, 0);
		} else {
			slider!.scrollBy(-200, 0);
		}
	};

	return (
		<div class={styles.categories}>
			<p>{t("categories.title")}</p>

			<div class={styles.subcategoriesScrollContainer}>
				<div class={styles.majorCategoriesContainer} ref={majorSliderRef}>
					<div class={styles.majorCategories}>
						<Toggle
							label={t("categories.all")}
							data-category="all"
							pressed={selectedMajor() === "all"}
							onChange={props.handleMajorCategoryChange}
						>
							{t("categories.all")}
						</Toggle>

						<For each={majorCategories()}>
							{(category) => (
								<Toggle
									onChange={props.handleMajorCategoryChange}
									label={category.arabic}
									data-category={category.english}
									pressed={selectedMajor() === category.english}
								>
									{category.arabic}
								</Toggle>
							)}
						</For>
					</div>
					<div
						class={clsx(styles.sliderArrowContainer, styles.firstSliderArrow)}
					>
						<Button
							class={styles.sliderArrow}
							data-direction="left"
							onClick={[handleScroll, majorSliderRef]}
						>
							<ArrowIcon />
						</Button>
					</div>
					<div class={styles.sliderArrowContainer}>
						<Button
							class={styles.sliderArrow}
							data-direction="right"
							onClick={[handleScroll, majorSliderRef]}
						>
							<ArrowIcon />
						</Button>
					</div>
				</div>
			</div>

			{subCategories().length > 0 && selectedMajor() !== "all" ? (
				<div class={styles.subcategoriesScrollContainer}>
					<div class={styles.subCategoriesContainer} ref={subSliderRef}>
						<div class={styles.subCategories}>
							<Toggle
								label={t("categories.all")}
								data-category="all"
								pressed={selectedSub() === "all"}
								onChange={props.handleSubCategoryChange}
								class={styles.subcategory}
							>
								{t("categories.all")}
							</Toggle>

							<For each={subCategories()}>
								{(category) => (
									<Toggle
										onChange={props.handleSubCategoryChange}
										label={category.arabic}
										data-category={category.english}
										pressed={selectedSub() === category.english}
										class={styles.subcategory}
									>
										{category.arabic}
									</Toggle>
								)}
							</For>
						</div>
					</div>
					<div
						class={clsx(styles.sliderArrowContainer, styles.firstSliderArrow)}
					>
						<Button
							class={styles.sliderArrow}
							data-direction="left"
							onClick={[handleScroll, subSliderRef]}
						>
							<ArrowIcon />
						</Button>
					</div>
					<div class={styles.sliderArrowContainer}>
						<Button
							class={styles.sliderArrow}
							data-direction="right"
							onClick={[handleScroll, subSliderRef]}
						>
							<ArrowIcon />
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
