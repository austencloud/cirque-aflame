/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svelte' {
	import type { ComponentType } from 'svelte';
	const component: ComponentType;
	export default component;
}

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
