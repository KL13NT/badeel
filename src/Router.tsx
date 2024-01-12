import { Routes, Route, Router } from "@solidjs/router";
import { Show, Suspense, lazy } from "solid-js";
import { Toaster } from "solid-toast";
import { Transition } from "solid-transition-group";

import Changelog from "~components/Changelog/Changelog";
import Layout from "~components/Layout/Layout";
import LoadingScreen from "~components/LoadingScreen/LoadingScreen";
import InstallPrompt from "~components/InstallPrompt/InstallPrompt";

import { hasOverlay } from "~stores/overlay";
import useBodyShouldScroll from "~hooks/useBodyShouldScroll";
import useOfflineReady from "~hooks/useOfflineReady";

const Acknowledgments = lazy(() => import("./pages/acknowledgments"));
const Home = lazy(() => import("./pages/home/index"));
const Submit = lazy(() => import("./pages/submit/index"));
const Feedback = lazy(() => import("./pages/feedback/index"));
const FAQ = lazy(() => import("./pages/faq/index"));

const overlayEntryKeyframes: Keyframe[] = [
	{ backdropFilter: "blur(0)", backgroundColor: "#00000000" },
	{ backdropFilter: "blur(5px)", backgroundColor: "#00000060" },
];

const overlayAnimationConfig: KeyframeAnimationOptions = {
	duration: 200,
	easing: "ease-out",
	fill: "forwards",
};

export default function AppRouter() {
	useOfflineReady();
	useBodyShouldScroll();

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

			<Transition
				onEnter={(el, done) => {
					el.animate(
						overlayEntryKeyframes,
						overlayAnimationConfig
					).finished.then(done);
				}}
				onExit={(el, done) => {
					el.animate(
						[...overlayEntryKeyframes].reverse(),
						overlayAnimationConfig
					).finished.then(done);
				}}
			>
				<Show when={hasOverlay()}>
					<div class="overlay" />
				</Show>
			</Transition>

			<InstallPrompt />
			<Changelog />

			<Router>
				<Layout>
					<Suspense fallback={<LoadingScreen />}>
						<Routes>
							<Route path="/acknowledgments" component={Acknowledgments} />
							<Route path="/submit" component={Submit} />
							<Route path="/feedback" component={Feedback} />
							<Route path="/faq" component={FAQ} />
							<Route path="*" component={Home} />
						</Routes>
					</Suspense>
				</Layout>
			</Router>
		</>
	);
}
