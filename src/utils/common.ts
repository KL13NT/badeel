const numberFormatter = new Intl.NumberFormat("ar-EG", {});

export const delay = (time: number, cb: () => void) => {
	const timeout = setTimeout(cb, time);
	return () => clearTimeout(timeout);
};

export const localizeNumber = (number: number) => {
	return numberFormatter.format(number);
};

export const arrayExists = (array: unknown[]) => {
	if (array && array.length > 0) return true;

	return false;
};
