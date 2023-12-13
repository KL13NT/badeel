/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare const BUILD_TIMESTAMP: string;

interface ImportMetaEnv {
	readonly BUILD_TIMESTAMP: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
