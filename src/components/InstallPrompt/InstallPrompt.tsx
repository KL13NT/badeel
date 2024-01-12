import { createEffect } from "solid-js";
import toast from "solid-toast";

import Button from "~components/Button/Button";

import { installEventSignal, setInstallEventSignal } from "~stores/install";
import { BeforeInstallPromptEvent } from "~types";

import styles from "./InstallPrompt.module.scss";

interface NotificationBodyProps {
	handleInstall: () => void;
	handleDismiss: () => void;
}

function NotificationBody(props: NotificationBodyProps) {
	return (
		<div class={styles.body}>
			<p>تنزيل البرنامج على هاتفك الجوال</p>

			<div class={styles.actions}>
				<Button variant="action-invert" onClick={props.handleInstall}>
					تنزيل
				</Button>
				<Button variant="default" onClick={props.handleDismiss}>
					ليس الآن
				</Button>
			</div>
		</div>
	);
}

function RejectionBody() {
	return (
		<div class={styles.rejected}>
			<p>
				تم إلغاء التنزيل. سنقوم بتذكيركم في المرة القادمة. إذا رغبتم في تنزيل
				البرنامج يدوياً يمكنكم من خلال{" "}
				<a
					href="https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid&oco=1"
					rel="noopener noreferrer"
					target="_blank"
				>
					التعليمات
				</a>
				.
			</p>
		</div>
	);
}

export default function InstallPrompt() {
	const handleInstall = async (
		toastId: string,
		event: BeforeInstallPromptEvent
	) => {
		toast.dismiss(toastId);

		const prompt = event;

		if (prompt) {
			prompt.prompt();

			const { outcome } = await prompt.userChoice;

			setInstallEventSignal(null);

			if (outcome === "accepted") {
				toast.success("يتم تنزيل البرنامج", {
					icon: "🥳",
				});

				localStorage.setItem("install-prompt", "installed");
			} else if (outcome === "dismissed") {
				toast.error(
					() => {
						return <RejectionBody />;
					},
					{
						duration: 5000,
					}
				);
			}
		}
	};

	const handleDismiss = (toastId: string) => {
		toast.dismiss(toastId);

		localStorage.setItem("install-prompt", "dismissed");
	};

	createEffect(() => {
		if (!installEventSignal()) {
			return;
		}

		toast.custom(
			(t) => {
				return (
					<NotificationBody
						handleInstall={() => handleInstall(t.id, installEventSignal()!)}
						handleDismiss={() => handleDismiss(t.id)}
					/>
				);
			},
			{
				position: "bottom-center",
				duration: Infinity,
			}
		);
	});

	return <></>;
}
