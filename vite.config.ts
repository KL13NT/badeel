import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
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
		mkcert(),
		vitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts",
							expiration: {
								maxEntries: 4,
								maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
							},
						},
					},
					{
						urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "static-font-assets",
							expiration: {
								maxEntries: 4,
								maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
							},
						},
					},
					{
						urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "static-image-assets",
							expiration: {
								maxEntries: 64,
								maxAgeSeconds: 24 * 60 * 60, // 24 hours
							},
						},
					},
					{
						urlPattern: /\.(?:js|ts)$/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "static-js-assets",
							expiration: {
								maxEntries: 32,
								maxAgeSeconds: 24 * 60 * 60, // 24 hours
							},
						},
					},
					{
						urlPattern: /\.(?:css|scss)$/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "static-style-assets",
							expiration: {
								maxEntries: 32,
								maxAgeSeconds: 24 * 60 * 60, // 24 hours
							},
						},
					},
					{
						urlPattern: /\.(?:json|xml|csv)$/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "static-data-assets",
							expiration: {
								maxEntries: 32,
								maxAgeSeconds: 24 * 60 * 60, // 24 hours
							},
						},
					},
					{
						urlPattern: /\/api\/.*$/i,
						handler: "NetworkFirst",
						method: "GET",
						options: {
							cacheName: "apis",
							expiration: {
								maxEntries: 16,
								maxAgeSeconds: 24 * 60 * 60, // 24 hours
							},
							networkTimeoutSeconds: 10, // fall back to cache if api does not response within 10 seconds
						},
					},
					{
						urlPattern: /.*/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "others",
							expiration: {
								maxEntries: 32,
								maxAgeSeconds: 24 * 60 * 60, // 24 hours
							},
							networkTimeoutSeconds: 10,
						},
					},
					{
						urlPattern: /(google)|(gstatic)/gi,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "google-documents-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 /* 1 day */,
							},
							matchOptions: {
								ignoreVary: true,
								ignoreSearch: true,
							},
							cacheableResponse: {
								statuses: [0, 200, 302, 307],
							},
						},
					},
				],
			},
			includeAssets: [
				"favicon.ico",
				"apple-touch-icon.png",
				"mask-icon.svg",
				"manifest.webmanifest",
			],
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
						src: "/icons/android-36x36.png",
						sizes: "36x36",
						type: "image/png",
					},
					{
						src: "/icons/android-48x48.png",
						sizes: "48x48",
						type: "image/png",
					},
					{
						src: "/icons/android-72x72.png",
						sizes: "72x72",
						type: "image/png",
					},
					{
						src: "/icons/android-96x96.png",
						sizes: "96x96",
						type: "image/png",
					},
					{
						src: "/icons/android-144x144.png",
						sizes: "144x144",
						type: "image/png",
					},
					{
						src: "/icons/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/icons/android-384x384.png",
						sizes: "384x384",
						type: "image/png",
					},
					{
						src: "/icons/android-chrome-512x512.png",
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
