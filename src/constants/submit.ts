import t from "~utils/messages";

export const arabicLettersRegex = /[\u0621-\u064A]+/;
export const englishLettersRegex = /[a-zA-Z]+/;

export const PRODUCT_TYPE_OPTIONS: {
	value: string;
	label: string;
}[] = [
	{
		value: "boycott",
		label: t("submit.boycott"),
	},
	{
		value: "alternative",
		label: t("submit.alternative"),
	},
	{
		value: "unsure",
		label: t("submit.unsure"),
	},
];
