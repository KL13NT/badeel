import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import dsv from "@rollup/plugin-dsv";
import { VitePWA as vitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
	server: {
		https: true,
	},
	plugins: [
		solid(),
		dsv(),
		mkcert(),
		vitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: ({ url }) =>
							url.origin.includes("googleusercontent.com") ||
							url.origin.includes("docs.google.com"),
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-cache",
							expiration: {
								maxEntries: 2,
								maxAgeSeconds: 60 * 60 * 2 /* 2 day */,
							},
						},
					},
				],
			},
			includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
			manifest: {
				name: "بديل | Badeel",
				short_name: "بديل",
				description: "موقع مصري هدفه تسهيل الوصول للمنتجات المقاطعة وبدائلها",
				theme_color: "#ffffff",
				display: "fullscreen",
				icons: [
					{
						src: "/launcher-icon-1x.png",
						sizes: "48x48",
						type: "image/png",
					},
					{
						src: "/launcher-icon-3x.png",
						sizes: "144x144",
						type: "image/png",
					},
				],
			},
		}),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					solid: ["solid-js"],
				},
			},
		},
	},
});
