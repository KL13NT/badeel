import { driver } from "driver.js";
import { createEffect } from "solid-js";

import { hasOverlay } from "~stores/overlay";

import "driver.js/dist/driver.css";
import styles from "./Tour.module.scss";

const tour = driver({
	showProgress: false,

	showButtons: ["next", "close", "previous"],
	popoverClass: styles.tour,
	progressText: `{{current}} من {{total}}`,
	nextBtnText: "التالي",
	prevBtnText: "السابق",
	doneBtnText: "إنهاء",

	onDestroyStarted: () => {
		if (tour.hasNextStep() && confirm("هل انت متأكد من إغلاق الرحلة؟")) {
			tour.destroy();
			localStorage.setItem("tour-done", String(true));
		} else if (!tour.hasNextStep()) {
			localStorage.setItem("tour-done", String(true));
		}
	},

	steps: [
		{
			element: undefined,
			popover: {
				title: "رحلة التشغيل",
				description:
					"مرحباً بكم في بَدِيل. إذا أردتم إلغاء الرحلة قوموا بالضغط على علامة x أعلاه.",
				side: "bottom",
				align: "center",
			},
		},
		{
			element: "[data-tour-id='search']",
			popover: {
				title: "البحث",
				description:
					"يمكنكم البحث عن أي مُنتج أو شركة باللغتين العربية والإنجليزية من خلال خانة البحث",
				side: "bottom",
				align: "center",
			},
		},
		{
			element: "[data-tour-id='filters']",
			popover: {
				title: "الإقسام والترتيب",
				description:
					"يمكنكم تحديد أقسام بعينها وتغيير ترتيب المُنتجات في قائمة العرض",
				side: "bottom",
				align: "center",
			},
		},
		{
			element: "[data-tour-id='header']",
			popover: {
				title: "يمكنكم مساعدتنا!",
				description:
					"إذا أردتم المساعدة يمكنكم ذلك من خلال إضافة المنتجات او إرسال اقتراحاتكم الينا!",
				side: "bottom",
				align: "center",
			},
		},
		{
			popover: {
				title: "نهاية الرحلة 🥳",
				description:
					"وبذلك تكون رحلتنا انتهت, يمكنكم الوصول لصفحة الأسئلة والأجوبة أسفل الموقع.",
				side: "bottom",
				align: "center",
				onNextClick: () => {
					localStorage.setItem("tour-done", String(true));
					tour.destroy();
				},
			},
		},
	],
});

export default function Tour() {
	createEffect(() => {
		const driven = localStorage.getItem("tour-done");

		if (!hasOverlay() && !driven) {
			tour.drive(0);
		} else {
			tour.destroy();
		}
	});

	return <></>;
}
