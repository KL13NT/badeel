import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import dsv from "@rollup/plugin-dsv";

export default defineConfig({
	plugins: [solid(), dsv()],
	assetsInclude: ["**/*.csv"],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					solid: ["solid-js"],
					data: ["./src/assets/data.csv"],
				},
			},
		},
	},
});
