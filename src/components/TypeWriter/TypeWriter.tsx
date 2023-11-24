import { batch, createSignal, onMount } from "solid-js";

import styles from "./TypeWriter.module.scss";
import clsx from "clsx";

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
	const [message, setMessage] = createSignal<string>("");

	const delay = (time: number, cb: () => void) => {
		setTimeout(() => {
			cb();
		}, time);
	};

	const start = () => {
		typeInterval = setInterval(() => {
			if (message().length === messages[messageIndex()].length) {
				batch(() => {
					const newIndex =
						(((messageIndex() + 1) % messages.length) + messages.length) %
						messages.length;

					const delayTime = Math.max(
						Math.min(8000, message().length * 100),
						3000
					);

					clearInterval(typeInterval!);
					delay(delayTime, () => {
						setMessageIndex(newIndex);
						setMessage("");
						start();
					});
				});

				return;
			}

			if (message().length === 0) {
				setMessage(messages[messageIndex()][0]);
			} else {
				setMessage(message() + messages[messageIndex()][message().length]);
			}
		}, 50);
	};

	onMount(() => {
		start();
	});

	return <p class={clsx(styles.typewriter, "title")}> {message()}</p>;
}
