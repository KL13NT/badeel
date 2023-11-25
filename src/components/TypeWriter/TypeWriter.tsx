import { batch, createSignal, onMount } from "solid-js";

import styles from "./TypeWriter.module.scss";
import clsx from "clsx";
import { delay } from "~utils/common";

const messages = [
	"بِدِّي شَعْرَةً مِنُّه",
	"يَابَا, مِش كَانَ بِدَّك تِطْلَع صَحَفِي؟",
	"كُنْتَ نَاوِي اعْمِلَّهَا عِيدَ مِيلَادٍ",
	"مِين ضَلَّ عَايَشَ؟!",
	"جِبْتِلَكْ ثَلَاثَ قَنَانِي حَلِيب بَفَكَّرَكَ بِدَّكْ تِعِيش وتِشْرَبْهُم يَابَا",
	"بِدِّي أَلْعَب, بِدِّي أَلْعَب بَسْ",
	"خَلِّية فِي حُضْنِي, خَلِّية فِي حُضْنِي",
];

let typeInterval: number | null = null;

export default function TypeWriter() {
	const [messageIndex, setMessageIndex] = createSignal<number>(0);
	const [writtenMessage, setWrittenMessage] = createSignal<string>("");

	const start = () => {
		typeInterval = setInterval(() => {
			const activeMessage = messages[messageIndex()];
			if (writtenMessage().length === activeMessage.length) {
				batch(() => {
					const newIndex =
						(((messageIndex() + 1) % messages.length) + messages.length) %
						messages.length;

					const delayTime = Math.max(
						Math.min(8000, writtenMessage().length * 100),
						3000
					);

					clearInterval(typeInterval!);
					delay(delayTime, () => {
						setMessageIndex(newIndex);
						setWrittenMessage("");
						start();
					});
				});

				return;
			}

			setWrittenMessage(activeMessage.slice(0, writtenMessage().length + 1));
		}, 50);
	};

	onMount(() => {
		start();
	});

	return (
		<p
			data-writing={writtenMessage().length < messages[messageIndex()].length}
			class={clsx(styles.typewriter, "title")}
		>
			{writtenMessage()}
		</p>
	);
}
