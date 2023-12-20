import styles from "./LoadingScreen.module.scss";

export default function LoadingScreen() {
	return (
		<div class={styles.loading}>
			<div class={styles.spinner}>
				<div />
				<div />
				<div />
				<div />
			</div>

			<p>يجري التحميل</p>
		</div>
	);
}
