import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'development',
			strategies: 'injectManifest',
			filename: 'service-worker.ts',
			scope: '/',
			base: '/',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest: {
				short_name: 'Ringmaster',
				name: 'Ringmaster - Circus Production Management',
				description: 'The ultimate circus business management for clients, performers, events, contracts, and agents',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#8B5CF6',
				background_color: '#ffffff',
				orientation: 'any',
				categories: ['business', 'productivity'],
				shortcuts: [
					{
						name: 'Dashboard',
						url: '/',
						description: 'View dashboard'
					},
					{
						name: 'Clients',
						url: '/clients',
						description: 'Manage clients'
					},
					{
						name: 'Events',
						url: '/events',
						description: 'Manage events'
					},
					{
						name: 'Add Event',
						url: '/events/new',
						description: 'Create new event'
					}
				]
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/'
			},
			kit: {}
		})
	],
	server: {
		port: parseInt(process.env.VITE_PORT || '3000', 10),
		strictPort: true
	}
});
