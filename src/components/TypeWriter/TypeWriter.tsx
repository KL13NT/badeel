import { onMount } from "solid-js";

import { delay } from "~utils/common";

import styles from "./TypeWriter.module.scss";

/**
 * Maximum character length should be 54 (calculated without Tashkeel).
 */
const messages = [
	"قَاوِمْ.. قَاطِعْ.. قَاتِل.",
	"بِدِّي شَعْرَةً مِنُّه",
	"روح الروح, هذى روح الروح",
	"والله ياما أخذت ٥٨٠ إبرة عشانه",
	"هَي أِمَّي.. بَعْرِفْها مِن شَعْرَهَا",
	"مَتْعَيَطِش يا زلَمِة, كِلنْا مَشروع شُهداء",
	"أمَانة يا خال نِفْسي أشوفه",
	"يَابَا, مِش كَانَ بِدَّك تِطْلَع صَحَفِي؟",
	"سَبَع سِنِين شَعْرُه أبْيَض وكيرلي وحِلو",
	"كُنْتَ نَاوِي اعْمِلَّهَا عِيدَ مِيلَادٍ",
	"مِين ضَلَّ عَايَشَ؟!",
	"جِبْتِلَكْ ثَلَاثَ قَنَانِي حَلِيب بَفَكَّرَكَ بِدَّكْ تِعِيش وتِشْرَبْهُم يَابَا",
	"بِدِّي أَلْعَب, بِدِّي أَلْعَب بَسْ",
	"خَلِّية فِي حُضْنِي, خَلِّية فِي حُضْنِي",
	"ماما أنا تِعِبْت من هذا الصوت, ماما بيكفي بدي انام",
];

let textRef: HTMLParagraphElement | undefined;
let messageIndex = 0;
let prevCharacterTimestamp = 0;

export default function TypeWriter() {
	const start = () => {
		if (!textRef) return requestAnimationFrame(start);

		const now = Date.now();
		if (now - prevCharacterTimestamp < 50) return requestAnimationFrame(start);

		const activeMessage = messages[messageIndex];
		const writtenMessage = textRef.textContent!;

		if (writtenMessage.length === activeMessage.length) {
			textRef.setAttribute("data-writing", "false");

			const newIndex =
				(((messageIndex + 1) % messages.length) + messages.length) %
				messages.length;

			const delayTime = Math.max(
				Math.min(8000, activeMessage.length * 100),
				3000
			);

			delay(delayTime, () => {
				messageIndex = newIndex;
				textRef!.textContent = "";
				textRef!.setAttribute("data-writing", "true");
				start();
			});

			return;
		}

		textRef.textContent = activeMessage.slice(0, writtenMessage.length + 1);
		prevCharacterTimestamp = Date.now();

		requestAnimationFrame(start);
	};

	onMount(() => {
		start();
	});

	return (
		<div class={styles.typewriter}>
			<p class="title" ref={textRef} />
		</div>
	);
}
