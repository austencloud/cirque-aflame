<script lang="ts">
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { faXmark, faDownload } from '@fortawesome/free-solid-svg-icons';

	let showPrompt = $state(false);
	let deferredPrompt: any = $state(null);
	let isStandalone = $state(false);

	onMount(() => {
		// Check if already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			isStandalone = true;
			return;
		}

		// Check if user has previously dismissed
		const dismissed = localStorage.getItem('pwa-install-dismissed');
		if (dismissed === 'true') {
			return;
		}

		// Listen for the install prompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;

			// Show our custom install prompt after a short delay
			setTimeout(() => {
				showPrompt = true;
			}, 3000);
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		// Listen for successful installation
		window.addEventListener('appinstalled', () => {
			deferredPrompt = null;
			showPrompt = false;
			isStandalone = true;
		});

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	});

	async function handleInstall() {
		if (!deferredPrompt) return;

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			console.log('User accepted the install prompt');
		} else {
			console.log('User dismissed the install prompt');
		}

		deferredPrompt = null;
		showPrompt = false;
	}

	function handleDismiss() {
		showPrompt = false;
		localStorage.setItem('pwa-install-dismissed', 'true');
	}
</script>

{#if showPrompt && !isStandalone}
	<div class="fixed bottom-4 right-4 z-50 animate-slide-up">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm border-2 border-purple-500">
			<div class="flex items-start justify-between mb-3">
				<div class="flex items-center gap-3">
					<div class="text-4xl">🎪</div>
					<div>
						<h3 class="font-bold text-lg text-gray-900 dark:text-white">Install CircusSync</h3>
						<p class="text-sm text-gray-600 dark:text-gray-300">Quick access from your home screen</p>
					</div>
				</div>
				<button
					onclick={handleDismiss}
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					aria-label="Close"
				>
					<Fa icon={faXmark} size="1.25x" />
				</button>
			</div>

			<div class="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					<span>Works offline</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					<span>Faster loading</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					<span>Desktop shortcut</span>
				</div>
			</div>

			<button
				onclick={handleInstall}
				class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
			>
				<Fa icon={faDownload} size="1.25x" />
				Install App
			</button>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-up {
		from {
			transform: translateY(100px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
</style>
