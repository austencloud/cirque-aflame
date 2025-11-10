<!-- src/lib/components/ui/ConfirmDialog.svelte -->
<script lang="ts"> import { fade } from 'svelte/transition';
	import Button from './Button.svelte'; interface Props { title?: string; message?: string; confirmText?: string; cancelText?: string; confirmColor?: 'blue' | 'green' | 'red' | 'amber'; isLoading?: boolean; onconfirm?: () => void; oncancel?: () => void; }

	const { title = 'Confirm', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'blue', isLoading = false, onconfirm, oncancel }: Props = $props();
</script>

<div class="dialog-overlay" data-component="ConfirmDialog" transition:fade={{ duration: 200 }}
> <div class="dialog-content" transition:fade={{ duration: 150, delay: 50 }} > <div class="dialog-body"> <h2 class="dialog-title">{title}</h2> <p class="dialog-message">{message}</p> </div> <div class="dialog-footer"> <Button variant="outline" color="gray" onclick={oncancel} disabled={isLoading} > {#snippet children()}{cancelText}{/snippet} </Button> <Button color={confirmColor} onclick={onconfirm} loading={isLoading} disabled={isLoading} > {#snippet children()}{confirmText}{/snippet} </Button> </div> </div>
</div> <style>
	.dialog-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background-color: rgba(0, 0, 0, 0.5); }

	.dialog-content { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft-lg); width: 100%; max-width: 28rem; overflow: hidden; }

	.dialog-body { padding: 1.5rem; }

	.dialog-title { font-size: 1.125rem; font-weight: 500; color: var(--color-gray-900); margin-bottom: 0.5rem; }

	.dialog-message { color: var(--color-gray-600); }

	.dialog-footer { padding: 1rem 1.5rem; background: var(--color-gray-50); border-top: 1px solid var(--color-gray-200); display: flex; justify-content: flex-end; gap: 0.75rem; }

</style>
