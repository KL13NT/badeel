const numberFormatter = new Intl.NumberFormat("ar-EG", {});
const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
	dateStyle: "medium",
});

export const delay = (time: number, cb: () => void) => {
	const timeout = setTimeout(cb, time);
	return () => clearTimeout(timeout);
};

export const localizeNumber = (number: number) => {
	return numberFormatter.format(number);
};

export function localizeDate(date: Date | string) {
	return dateFormatter.format(new Date(date));
}

export const arrayExists = (array: unknown[]) => {
	if (array && array.length > 0) return true;

	return false;
};
