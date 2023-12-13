import { SortOption, Status } from "~types";
import t from "~utils/messages";

export const STATUS_FILTER_CHECKBOX_OPTIONS = [
	{
		value: "boycott",
		title: t("filters.boycott"),
	},
	{
		value: "alternative",
		title: t("filters.alternative"),
	},
	{
		value: "unsure",
		title: t("filters.unsure"),
	},
] as const;

export const SORT_OPTIONS: {
	name: string;
	value: SortOption;
}[] = [
	{
		name: t("sort.arabicName"),
		value: "Name",
	},
	{
		name: t("sort.englishName"),
		value: "English Name",
	},
	{
		name: t("sort.status"),
		value: "status",
	},
	{
		name: t("sort.category"),
		value: "Category",
	},
];

export const STATUS_TITLE_MAPPING: Record<Status, string> = {
	alternative: "بديل",
	boycott: "داعم",
	unsure: "قيد المراجعة",
} as const;
