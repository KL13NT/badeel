import { JSX } from "solid-js/jsx-runtime";
import { A } from "@solidjs/router";

import NavigationFilter from "~components/NavigationFilter/NavigationFilter";
import Button from "~components/Button/Button";
import { SUBMIT_PRODUCT_FORM } from "~constants/documents";

import HandshakeIcon from "~assets/icons/handshake.svg?component-solid";

import styles from "./Layout.module.scss";

import logo from "~assets/icons/logo.svg";

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

			<main class={styles.main}>{props.children}</main>

			<footer>
				<p>جميع الحقوق محفوظة.</p>
				<A href="/acknowledgments">شكر وتقدير لكل من ساهم في هذا المشروع.</A>
			</footer>
		</>
	);
}
