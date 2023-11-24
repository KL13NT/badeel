import t from "~utils/messages";

export const STATUS_FILTER_OPTIONS = [
	{
		key: "all",
		title: t("filter.all"),
	},
	{
		key: "boycott",
		title: t("filter.boycott"),
	},
	{
		key: "alternative",
		title: t("filter.alternative"),
	},
	{
		key: "unsure",
		title: t("filter.unsure"),
	},
] as const;
