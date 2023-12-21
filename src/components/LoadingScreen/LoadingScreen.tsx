import styles from "./LoadingScreen.module.scss";

import Palestine from "~assets/icons/palestine.svg?component-solid";

export default function LoadingScreen() {
	return (
		<div class={styles.loading} role="alert" aria-live="assertive">
			<div>
				<Palestine />
				<h1>جارِ التحميل</h1>
			</div>
		</div>
	);
}
