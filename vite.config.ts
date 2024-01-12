import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { VitePWA as vitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";
import devtools from "solid-devtools/vite";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
	define: {
		"import.meta.env.BUILD_TIMESTAMP": new Date(),
	},
	assetsInclude: ["./changelogs/*.md"],
	server: {
		https: true,
	},
	plugins: [
		tsconfigPaths(),
		solid(),
		solidSvg({
			defaultAsComponent: false,
			svgo: {
				svgoConfig: {
					removeViewBox: false,
				},
			},
		}),
		devtools({
			autoname: true,
			locator: {
				targetIDE: "vscode",
				componentLocation: true,
				jsxLocation: true,
			},
		}),
		mkcert(),
		vitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
				navigateFallback: "index.html",
			},
			workbox: {
				cleanupOutdatedCaches: false,
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
						},
					},
					{
						urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
						handler: "NetworkFirst",
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
						handler: "NetworkFirst",
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
						handler: "NetworkFirst",
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
						urlPattern: /(google)|(gstatic)/gi,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "google-documents-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 7 /* 1 week */,
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
				],
			},
			includeAssets: [
				"favicon.ico",
				"favicon.svg",
				"icons/",
				"29LTAdaFlat-Black.ttf",
				"29LTAdaFlat-Bold.ttf",
				"manifest.webmanifest",
				"og.png",
			],
			manifest: {
				name: "بديل | Badeel",
				short_name: "بديل",
				description: "موقع مصري هدفه تسهيل الوصول للمنتجات المقاطعة وبدائلها",
				theme_color: "#b8b7adff",
				background_color: "#1a1a1a",
				display: "standalone",
				orientation: "portrait",
				icons: [
					{
						src: "/icons/android/android-launchericon-512-512.png",
						type: "image/png",
						sizes: "512x512",
					},
					{
						src: "/icons/android/android-launchericon-192-192.png",
						type: "image/png",
						sizes: "192x192",
					},
					{
						src: "/icons/android/android-launchericon-144-144.png",
						type: "image/png",
						sizes: "144x144",
					},
					{
						src: "/icons/android/android-launchericon-96-96.png",
						type: "image/png",
						sizes: "96x96",
					},
					{
						src: "/icons/android/android-launchericon-72-72.png",
						type: "image/png",
						sizes: "72x72",
					},
					{
						src: "/icons/android/android-launchericon-48-48.png",
						type: "image/png",
						sizes: "48x48",
					},
					{
						src: "/icons/ios/16.png",
						type: "image/png",
						sizes: "16x16",
					},
					{
						src: "/icons/ios/20.png",
						type: "image/png",
						sizes: "20x20",
					},
					{
						src: "/icons/ios/29.png",
						type: "image/png",
						sizes: "29x29",
					},
					{
						src: "/icons/ios/32.png",
						type: "image/png",
						sizes: "32x32",
					},
					{
						src: "/icons/ios/40.png",
						type: "image/png",
						sizes: "40x40",
					},
					{
						src: "/icons/ios/50.png",
						type: "image/png",
						sizes: "50x50",
					},
					{
						src: "/icons/ios/57.png",
						type: "image/png",
						sizes: "57x57",
					},
					{
						src: "/icons/ios/58.png",
						type: "image/png",
						sizes: "58x58",
					},
					{
						src: "/icons/ios/60.png",
						type: "image/png",
						sizes: "60x60",
					},
					{
						src: "/icons/ios/64.png",
						type: "image/png",
						sizes: "64x64",
					},
					{
						src: "/icons/ios/72.png",
						type: "image/png",
						sizes: "72x72",
					},
					{
						src: "/icons/ios/76.png",
						type: "image/png",
						sizes: "76x76",
					},
					{
						src: "/icons/ios/80.png",
						type: "image/png",
						sizes: "80x80",
					},
					{
						src: "/icons/ios/87.png",
						type: "image/png",
						sizes: "87x87",
					},
					{
						src: "/icons/ios/100.png",
						type: "image/png",
						sizes: "100x100",
					},
					{
						src: "/icons/ios/114.png",
						type: "image/png",
						sizes: "114x114",
					},
					{
						src: "/icons/ios/120.png",
						type: "image/png",
						sizes: "120x120",
					},
					{
						src: "/icons/ios/128.png",
						type: "image/png",
						sizes: "128x128",
					},
					{
						src: "/icons/ios/144.png",
						type: "image/png",
						sizes: "144x144",
					},
					{
						src: "/icons/ios/152.png",
						type: "image/png",
						sizes: "152x152",
					},
					{
						src: "/icons/ios/167.png",
						type: "image/png",
						sizes: "167x167",
					},
					{
						src: "/icons/ios/180.png",
						type: "image/png",
						sizes: "180x180",
					},
					{
						src: "/icons/ios/192.png",
						type: "image/png",
						sizes: "192x192",
					},
					{
						src: "/icons/ios/256.png",
						type: "image/png",
						sizes: "256x256",
					},
					{
						src: "/icons/ios/512.png",
						type: "image/png",
						sizes: "512x512",
					},
					{
						src: "/icons/ios/1024.png",
						type: "image/png",
						sizes: "1024x1024",
					},
				],
			},
		}),
	],
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					solid: ["solid-js"],
				},
			},
		},
	},
});
