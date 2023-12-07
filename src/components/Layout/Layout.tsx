import { JSX } from "solid-js/jsx-runtime";
import { onMount } from "solid-js";
import { A } from "@solidjs/router";

import Button from "~components/Button/Button";

import t from "~utils/messages";
import { SUBMIT_PRODUCT_FORM } from "~constants/documents";

import styles from "./Layout.module.scss";

import HandshakeIcon from "~assets/icons/handshake.svg?component-solid";

import logo from "~assets/icons/logo.svg";

interface Props {
	children: JSX.Element;
}

let headerRef: HTMLDivElement | undefined;

export default function Layout(props: Props) {
	onMount(() => {
		let lastScrollTop =
			window?.scrollY || document?.documentElement?.scrollTop || 0;
		let visible = true;

		const getViewportWidth = () => {
			return Math.max(
				document.documentElement.clientWidth || 0,
				window.innerWidth || 0
			);
		};

		const hide = () => {
			headerRef!.style.transform = "translateY(-100%)";

			visible = false;
		};

		const show = () => {
			headerRef!.style.transform = "translateY(0)";

			visible = true;
		};

		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;

			if (scrollTop < lastScrollTop && !visible) {
				show();
			} else if (scrollTop > 120 && scrollTop > lastScrollTop && visible) {
				hide();
			}

			lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Negative scrolling
		};

		if (getViewportWidth() <= 700) {
			document.addEventListener("scroll", handleScroll, false);
		} else {
			headerRef!.style.position = "relative";
		}

		window.addEventListener("resize", () => {
			if (getViewportWidth() <= 700) {
				document.addEventListener("scroll", handleScroll, false);
				headerRef!.style.position = "fixed";
			} else {
				show();
				headerRef!.style.position = "relative";
				document.removeEventListener("scroll", handleScroll, false);
			}
		});
	});

	return (
		<>
			<nav class={styles.navbar} ref={headerRef}>
				<div class={styles.upper}>
					<div class={styles.right}>
						<A href="/">
							<img src={logo} class={styles.logo} alt="" role="presentation" />
						</A>
					</div>

					<div class={styles.left}>
						<a
							class={styles.feedback}
							href="https://forms.gle/ELeQ5rtuEVVLipwV9"
							target="_blank"
						>
							{t("navbar.feedback")}
						</a>

						<div class={styles.separator} />

						<Button
							as="a"
							href={SUBMIT_PRODUCT_FORM}
							class={styles.add}
							target="_blank"
							variant="danger"
						>
							<HandshakeIcon />
							{t("navbar.add")}
						</Button>
					</div>
				</div>
			</nav>

			<main class={styles.main}>{props.children}</main>

			<footer class={styles.footer}>
				<p>
					جميع الحقوق محفوظة. مفتوح المصدر على{" "}
					<a href="https://github.com/KL13NT/badeel">GitHub</a>.
				</p>
				<p>هذا الموقع لا يُحرِّض على مقاطعة مُنتَج أو شركة بعينها.</p>
			</footer>
		</>
	);
}
