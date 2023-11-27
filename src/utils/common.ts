const numberFormatter = new Intl.NumberFormat("ar-EG", {});

export const delay = (time: number, cb: () => void) => {
	const timeout = setTimeout(cb, time);
	return () => clearTimeout(timeout);
};

export const localizeNumber = (number: number) => {
	return numberFormatter.format(number);
};
