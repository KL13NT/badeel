import { Show } from "solid-js";

import Button from "~components/Button/Button";
import Input from "~components/Forms/Input/Input";

import { useLoading } from "~hooks/useLoading";
import { FEEDBACK_ACTION, FEEDBACK_FORM } from "~constants/documents";

import styles from "./index.module.scss";

import LoadingIcon from "~assets/icons/loading.svg?component-solid";
import { A } from "@solidjs/router";

export default function Feedback() {
	const { loadingState, setLoadingState } = useLoading();

	const handleSubmit = async (ev: SubmitEvent) => {
		ev.preventDefault();

		setLoadingState({
			status: "submitting",
		});

		const form = ev.currentTarget as HTMLFormElement;
		const data = new FormData(form);

		try {
			const response = await fetch(FEEDBACK_ACTION, {
				method: "POST",
				body: data,
			});

			const json = await response.json();

			if (json.error) {
				return setLoadingState({
					status: "error",
					context: json.error,
				});
			}

			setLoadingState({
				status: "submitted",
			});

			form.reset();
		} catch (error) {
			setLoadingState({
				status: "error",
				context: "NETWORK_ERROR",
			});
		}
	};

	const status = () => loadingState().status;
	const context = () => loadingState().context;

	return (
		<>
			<section class={styles.container}>
				<div class={styles.body}>
					<h1 class="title">صندوق إقتراحات بَدِيل</h1>

					<p>
						نشكركم مقدماً على تقديم الدعم لبديل من خلال إرسالكم لهذا الإستبيان!
						رجاء العِلم أن فريق بديل يقومون بتطوير المشروع في أوقات فراغهم ولذلك
						يُمكن ان تتأخر تلك الخاصية أو لا تُضاف لأي سبب كان. إذا احببت ان
						نقوم بإبلاغك برجاء ترك الإيميل الالكتروني الخاص بك مع الطلب.
					</p>

					<p>
						رجاء إستخدام <A href="/submit">إستبيان المُنتجات</A> لإضافة منتجات
						لبديل.
					</p>

					<p>
						رجاء التأكد من عدم وجود سؤالك على{" "}
						<A href="/faq">صفحة الأسئلة والأجوبة</A>.
					</p>

					<form onSubmit={handleSubmit} class={styles.form}>
						<Input
							name="comment"
							as="textarea"
							label="ماذا تُحب ان نُضيف؟/مِمَّا تشتكي؟"
							type="text"
							autocomplete="off"
							placeholder="اكتب ما تريد بالتفصيل"
							required
						/>

						<Button
							type="submit"
							variant="default"
							class={styles.submit}
							disabled={status() === "submitting"}
							data-status={status()}
						>
							{status() === "submitting" ? "يجري الإرسال" : "إرسال"}
							<LoadingIcon role="presentation" />
						</Button>
					</form>

					<Show
						when={
							status() === "error" &&
							[undefined, "SERVER_ERROR", "INVALID_SUBMISSION"].includes(
								context()
							)
						}
					>
						<p class="error" role="alert">
							حدث خطأ أثناء تسجيل رسالتك. أعد المحاولة. إذا فشل التسجيل مجدداً
							برجاء التوجه الى{" "}
							<a href={FEEDBACK_FORM} target="_blank">
								إستبيان جووجل فورم
							</a>{" "}
							الخاص بنا وملء رسالتك هناك. نعتذر لكم على هذا الإزعاج.
						</p>
					</Show>

					<Show when={status() === "error" && context() === "NETWORK_ERROR"}>
						<p class="error" role="alert">
							حدث خطأ أثناء تسجيل رسالتك. برجاء التأكد من إتصالك بالإنترنت وعدم
							حجب المتصفح الخاص بِك الإتصال بمواقع جووجل من خلالنا.
						</p>
					</Show>

					<Show when={status() === "submitted"}>
						<p class="success" role="alert">
							تم الإرسال بنجاح. سيقوم فريق بَدِيل بقراءة رسالتك في أقرب وقت.
						</p>
					</Show>
				</div>
			</section>
		</>
	);
}
