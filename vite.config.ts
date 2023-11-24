import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import dsv from "@rollup/plugin-dsv";
import { VitePWA as vitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";
import devtools from "solid-devtools/vite";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
	server: {
		https: true,
	},
	plugins: [
		tsconfigPaths(),
		solid(),
		solidSvg({
			defaultAsComponent: false,
		}),
		devtools(),
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
				theme_color: "#b8b7adff",
				background_color: "#1a1a1a",
				display: "fullscreen",
				orientation: "portrait",
				icons: [
					{
						src: "/icons/icon-72x72.png",
						sizes: "72x72",
						type: "image/png",
					},
					{
						src: "/icons/icon-96x96.png",
						sizes: "96x96",
						type: "image/png",
					},
					{
						src: "/icons/icon-128x128.png",
						sizes: "128x128",
						type: "image/png",
					},
					{
						src: "/icons/icon-144x144.png",
						sizes: "144x144",
						type: "image/png",
					},
					{
						src: "/icons/icon-152x152.png",
						sizes: "152x152",
						type: "image/png",
					},
					{
						src: "/icons/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/icons/icon-384x384.png",
						sizes: "384x384",
						type: "image/png",
					},
					{
						src: "/icons/icon-512x512.png",
						sizes: "512x512",
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
