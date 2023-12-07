import { MESSAGES } from "~constants/messages";

export type MessageKey = keyof typeof MESSAGES;

export default function t(key: MessageKey) {
	return MESSAGES[key];
}
