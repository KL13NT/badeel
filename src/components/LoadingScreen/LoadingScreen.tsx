import styles from "./LoadingScreen.module.scss";

export default function LoadingScreen() {
	return (
		<div class={styles.loading} role="alert" aria-live="assertive">
			<div>
				<h1>يجري التحميل</h1>

				<div class={styles.spinner}>
					<div />
					<div />
					<div />
					<div />
				</div>
			</div>
		</div>
	);
}
