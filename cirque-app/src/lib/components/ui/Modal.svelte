<!-- src/lib/components/ui/Modal.svelte -->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Icon from './Icon.svelte';

	interface Props {
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		showClose?: boolean;
		closeOnClickOutside?: boolean;
		closeOnEsc?: boolean;
		onclose?: () => void;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	const {
		title = '',
		size = 'md',
		showClose = true,
		closeOnClickOutside = true,
		closeOnEsc = true,
		onclose,
		children,
		footer
	}: Props = $props();

	// Handle closing the modal
	function close() {
		onclose?.();
	}

	// Handle click outside
	function handleClickOutside(event: MouseEvent) {
		if (closeOnClickOutside && event.target === event.currentTarget) {
			close();
		}
	}

	// Handle keyboard events
	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEsc && event.key === 'Escape') {
			close();
		}
	}

	// When modal is mounted, add key event listener and prevent body scrolling
	$effect(() => {
		document.addEventListener('keydown', handleKeydown);
		document.body.style.overflow = 'hidden';

		// Cleanup function
		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={handleClickOutside} transition:fade={{ duration: 200 }} data-component="Modal"
> <div class="modal-content {size}" transition:fly={{ y: 20, duration: 200 }} > {#if title || showClose} <div class="modal-header"> <h2 class="modal-title">{title}</h2> {#if showClose} <button class="modal-close" onclick={close} aria-label="Close" > <Icon name="x" size={24} /> </button> {/if} </div> {/if} <div class="modal-scroll"> <div class="modal-body"> {#if children} {@render children()} {/if} </div> {#if footer} <div class="modal-footer"> {@render footer()} </div> {/if} </div> </div>
</div> <style>
	.modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0, 0, 0, 0.5); }

	.modal-content { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft-lg); width: 100%; position: relative; overflow: hidden; } /* Sizes */ .modal-content.sm { max-width: 24rem; }

	.modal-content.md { max-width: 28rem; }

	.modal-content.lg { max-width: 32rem; }

	.modal-content.xl { max-width: 36rem; }

	.modal-content.full { max-width: 100%; }

	.modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--color-gray-200); display: flex; justify-content: space-between; align-items: center; }

	.modal-title { font-size: 1.125rem; font-weight: 500; color: var(--color-gray-900); }

	.modal-close { color: var(--color-gray-400); background: none; border: none; cursor: pointer; transition: color var(--transition-base); padding: 0; }

	.modal-close:hover, .modal-close:focus { color: var(--color-gray-500); outline: none; }

	.modal-scroll { overflow-y: auto; max-height: calc(100vh - 10rem); }

	.modal-body { padding: 1rem 1.5rem; }

	.modal-footer { padding: 1rem 1.5rem; background: var(--color-gray-50); border-top: 1px solid var(--color-gray-200); }

</style>
