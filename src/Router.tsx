import { Routes, Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

import Layout from "~components/Layout/Layout";
import OfflinePrompt from "~components/OfflinePrompt/OfflinePrompt";

const Acknowledgments = lazy(() => import("./pages/acknowledgments"));
const Why = lazy(() => import("./pages/why"));
const Home = lazy(() => import("./pages/home/index"));

export default function AppRouter() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/acknowledgments" component={Acknowledgments} />
					<Route path="/why" component={Why} />
					<Route path="*" component={Home} />
				</Routes>

				<OfflinePrompt />
			</Layout>
		</Router>
	);
}
