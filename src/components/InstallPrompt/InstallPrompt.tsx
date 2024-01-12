import { createEffect } from "solid-js";
import toast from "solid-toast";

import Button from "~components/Button/Button";

import { installEventSignal, setInstallEventSignal } from "~stores/install";
import { BeforeInstallPromptEvent } from "~types";
import { PWA_INSTALL_GUIDE } from "~constants/documents";

import styles from "./InstallPrompt.module.scss";

interface NotificationBodyProps {
	handleInstall: () => void;
	handleDismiss: () => void;
}

function NotificationBody(props: NotificationBodyProps) {
	return (
		<div class={styles.body}>
			<h2>تثبيت التطبيق</h2>
			<p>التثبيت لا يستخدم أي مساحة تخزين ويوفر طريقة سريعة للعودة لبَدِيل.</p>

			<div class={styles.actions}>
				<Button variant="action-invert" onClick={props.handleInstall}>
					تثبيت
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
				تم إلغاء التثبيت. سنقوم بتذكيركم في المرة القادمة. إذا رغبتم في تثبيت
				التطبيق يدوياً رجاء اتباع التعليمات المذكورة في{" "}
				<a href={PWA_INSTALL_GUIDE} rel="noopener noreferrer" target="_blank">
					دليل التثبيت
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
				toast.success("يتم تثبيت التطبيق", {
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
						unmountDelay: 500,
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
