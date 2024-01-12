import { useRegisterSW } from "virtual:pwa-register/solid";
import { createEffect } from "solid-js";

import toast from "solid-toast";

export default function useOfflineReady() {
	const {
		offlineReady: [offlineReady, setOfflineReady],
	} = useRegisterSW({
		immediate: true,
	});

	createEffect(() => {
		if (offlineReady()) {
			toast.success("التطبيق جاهز للعمل بدون إنترنت", {
				icon: "🥳",
			});

			setOfflineReady(false);
		}
	});
}
