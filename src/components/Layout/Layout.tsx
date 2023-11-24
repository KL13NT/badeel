import { JSX } from "solid-js/jsx-runtime";

import logo from "~assets/icons/logo.svg";
import styles from "./Layout.module.scss";
import NavigationFilter from "~components/NavigationFilter/NavigationFilter";
import Button from "~components/Button/Button";
import { SUBMIT_PRODUCT_FORM } from "~constants/documents";
import HandshakeIcon from "~assets/icons/handshake.svg?component-solid";
import { A } from "@solidjs/router";

interface Props {
	children: JSX.Element;
}

export default function Layout(props: Props) {
	return (
		<>
			<nav class={styles.navbar}>
				<div class={styles.right}>
					<img src={logo} alt="" role="presentation" />

					<NavigationFilter />
				</div>

				<div class={styles.left}>
					<Button
						as="a"
						href={SUBMIT_PRODUCT_FORM}
						class={styles.add}
						variant="danger"
					>
						<HandshakeIcon />
						أضف منتج أو شركة
					</Button>
				</div>
			</nav>

			{props.children}

			<footer>
				<p>جميع الحقوق محفوظة.</p>
				<A href="/acknowledgments">شكر وتقدير لكل من ساهم في هذا المشروع.</A>
			</footer>
		</>
	);
}
