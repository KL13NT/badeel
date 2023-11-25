export const delay = (time: number, cb: () => void) => {
	const timeout = setTimeout(cb, time);
	return () => clearTimeout(timeout);
};
