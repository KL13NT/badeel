import { Status } from "~types";
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

export const STATUS_TITLE_MAPPING: Record<Status, string> = {
	alternative: "بديل",
	boycott: "داعم",
	unsure: "قيد المراجعة",
} as const;
