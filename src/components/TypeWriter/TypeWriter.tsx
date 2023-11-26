import { onMount } from "solid-js";

import styles from "./TypeWriter.module.scss";
import clsx from "clsx";
import { delay } from "~utils/common";

const messages = [
	"بِدِّي شَعْرَةً مِنُّه",
	"روح الروح, هذى روح الروح",
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

let typeInterval: number | null = null;
let textRef: HTMLParagraphElement | undefined;
let messageIndex = 0;

export default function TypeWriter() {
	const start = () => {
		typeInterval = setInterval(() => {
			if (!textRef) return;

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

				clearInterval(typeInterval!);
				delay(delayTime, () => {
					messageIndex = newIndex;
					textRef!.textContent = "";
					textRef!.setAttribute("data-writing", "true");

					start();
				});

				return;
			}

			textRef.textContent = activeMessage.slice(0, writtenMessage.length + 1);
		}, 50);
	};

	onMount(() => {
		start();
	});

	return <p class={clsx(styles.typewriter, "title")} ref={textRef} />;
}
