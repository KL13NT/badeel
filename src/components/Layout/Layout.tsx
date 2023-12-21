import { JSX } from "solid-js/jsx-runtime";
import { onMount } from "solid-js";
import { A } from "@solidjs/router";

import Button from "~components/Button/Button";
import BackToTopButton from "~components/BackToTopButton/BackToTopButton";

import t from "~utils/messages";
import { FEEDBACK_FORM } from "~constants/documents";
import { localizeDate } from "~utils/common";

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
						<A href="/" id="logo">
							<img src={logo} class={styles.logo} alt="" role="presentation" />
						</A>
					</div>

					<div class={styles.left}>
						<A class={styles.feedback} href="/feedback">
							{t("navbar.feedback")}
						</A>

						<div class={styles.separator} />

						<Button as={A} href="/submit" class={styles.add} variant="danger">
							<HandshakeIcon />
							{t("navbar.add")}
						</Button>
					</div>
				</div>

				<div class={styles.lower}>
					<p>
						{t("version")} {localizeDate(import.meta.env.BUILD_TIMESTAMP)}
					</p>
					<a class={styles.feedback} href={FEEDBACK_FORM} target="_blank">
						{t("navbar.feedback")}
					</a>
				</div>
			</nav>

			<main class={styles.main}>{props.children}</main>

			<BackToTopButton />

			<footer class={styles.footer}>
				<p>
					تطبيقنا هو أداة تم تصميمها لتسهيل عملية الوصول للمنتجات أو الخدمات
					بناءً على اختيارات شخصية. يجب على المستخدمين أن يدركوا أن هذا التطبيق
					لا يشجع بأي شكل من الأشكال على التصرف بطريقة غير قانونية.
				</p>
				<p>
					نلفت انتباه المستخدمين إلى أن المعلومات المقدمة عبر التطبيق هي لأغراض
					معلوماتية فقط وقد لا تكون دقيقة أو محدثة. يتحمل المستخدمون مسؤولية
					التحقق من صحة المعلومات والتأكد من مصداقيتها قبل اتخاذ أي إجراء.
				</p>
				<p>
					نؤكد بشكل صريح أننا لا نتحمل أي مسؤولية عن أي تصرف قد يقوم به
					المستخدمون نتيجة لاستخدام هذا التطبيق. يجب على المستخدمين أن يكونوا
					حذرين ويمتنعوا عن اتخاذ أي إجراء دون التحقق الشخصي والاعتماد على مصادر
					متعددة.
				</p>
				<p>
					يرجى فهم أن التطبيق يقدم فقط وسيلة لتنظيم وتوجيه القرارات الفردية، ولا
					يمكننا تحميلنا بأي شكل من الأشكال مسؤولية أو تزامن عندما يتعلق الأمر
					بتصرفات المستخدمين الفردية.
				</p>
				<p>
					جميع الحقوق محفوظة. مفتوح المصدر على{" "}
					<a
						href="https://github.com/KL13NT/badeel"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>{" "}
					و{" "}
					<a
						href="https://docs.google.com/spreadsheets/d/1chPpWQa_zRAgLIS1RtNyKnDayGyEndG4Sqg-KmGqIuo/edit#gid=691355630"
						target="_blank"
						rel="noopener noreferrer"
					>
						Spreadsheets
					</a>
					.
				</p>
			</footer>
		</>
	);
}
