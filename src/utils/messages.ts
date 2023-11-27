import { MESSAGES } from "~constants/messages";

type MessageKey = keyof typeof MESSAGES;

export default function t(key: MessageKey) {
	return MESSAGES[key];
}
