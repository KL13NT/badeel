import { MESSAGES } from "~constants/messages";

export default function t(key: keyof typeof MESSAGES) {
	return MESSAGES[key];
}
