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
}

let sliderRef: HTMLDivElement;

export default function Filters(props: Props) {
	const { params, updateMajorCategory, updateSubCategory } = useSearchQuery();

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

	const handleMajorCategoryChange = (enabled: boolean, ev: MouseEvent) => {
		const target = ev.target as HTMLButtonElement;
		const category = target.dataset.category!;

		if (enabled) {
			updateMajorCategory(category);
		}
	};

	const handleSubCategoryChange = (enabled: boolean, ev: MouseEvent) => {
		const target = ev.target as HTMLButtonElement;
		const category = target.dataset.category!;

		if (enabled) {
			updateSubCategory(category);
		}
	};

	const handleScroll = (ev: MouseEvent) => {
		if (!sliderRef) return;

		const target = ev.target as HTMLDivElement;
		const direction = target.closest("button")!.dataset.direction!;

		if (direction === "left") {
			sliderRef!.scrollBy(200, 0);
		} else {
			sliderRef!.scrollBy(-200, 0);
		}
	};

	return (
		<div class={styles.categories}>
			<p>{t("categories.title")}</p>

			<div class={styles.majorCategories}>
				<Toggle
					label={t("categories.all")}
					data-category="all"
					pressed={selectedMajor() === "all"}
					onChange={handleMajorCategoryChange}
				>
					{t("categories.all")}
				</Toggle>

				<For each={majorCategories()}>
					{(category) => (
						<Toggle
							onChange={handleMajorCategoryChange}
							label={category.arabic}
							data-category={category.english}
							pressed={selectedMajor() === category.english}
						>
							{category.arabic}
						</Toggle>
					)}
				</For>
			</div>

			{subCategories().length > 0 && selectedMajor() !== "all" ? (
				<div class={styles.subcategoriesScrollContainer}>
					<div class={styles.subCategoriesContainer} ref={sliderRef}>
						<div class={styles.subCategories}>
							<Toggle
								label={t("categories.all")}
								data-category="all"
								pressed={selectedSub() === "all"}
								onChange={handleSubCategoryChange}
								class={styles.subcategory}
							>
								{t("categories.all")}
							</Toggle>

							<For each={subCategories()}>
								{(category) => (
									<Toggle
										onChange={handleSubCategoryChange}
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
							onClick={handleScroll}
						>
							<ArrowIcon />
						</Button>
					</div>
					<div class={styles.sliderArrowContainer}>
						<Button
							class={styles.sliderArrow}
							data-direction="right"
							onClick={handleScroll}
						>
							<ArrowIcon />
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
