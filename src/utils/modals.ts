export const handleClickOutside =
	(close: () => void, containerClass: string) => (ev: MouseEvent) => {
		const target = ev.target as HTMLElement;

		if (!target.closest(containerClass)) {
			close();
		}
	};
