import { Routes, Route, Router } from "@solidjs/router";
import { Suspense, lazy } from "solid-js";
import { Toaster } from "solid-toast";

import Layout from "~components/Layout/Layout";
import LoadingScreen from "~components/LoadingScreen/LoadingScreen";
import OfflinePrompt from "~components/OfflinePrompt/OfflinePrompt";

const Acknowledgments = lazy(() => import("./pages/acknowledgments"));
const Home = lazy(() => import("./pages/home/index"));
const Submit = lazy(() => import("./pages/submit/index"));
const Feedback = lazy(() => import("./pages/feedback/index"));

export default function AppRouter() {
	return (
		<>
			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						background: "var(--c-bg)",
						color: "var(--c-body-1)",
					},
					ariaProps: {
						role: "alert",
						"aria-live": "assertive",
					},
				}}
			/>
			<Router>
				<Layout>
					<Suspense fallback={<LoadingScreen />}>
						<Routes>
							<Route path="/acknowledgments" component={Acknowledgments} />
							<Route path="/submit" component={Submit} />
							<Route path="/feedback" component={Feedback} />
							<Route path="*" component={Home} />
						</Routes>
					</Suspense>

					<OfflinePrompt />
				</Layout>
			</Router>
		</>
	);
}
