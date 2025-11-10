<!-- src/lib/components/ui/Tab.svelte -->
<script lang="ts"> interface Props { label: string; active?: boolean; disabled?: boolean; icon?: string | null; badge?: string | null; onclick?: (e: MouseEvent) => void; iconSlot?: import('svelte').Snippet; }

	const { label, active = false, disabled = false, icon = null, badge = null, onclick, iconSlot }: Props = $props();
</script>

<button class="tab" class:active class:disabled {disabled} {onclick} data-component="Tab"
> <div class="tab-content"> {#if icon} <span class="tab-icon"> {#if iconSlot} {@render iconSlot()} {/if} </span> {/if} {label} {#if badge} <span class="tab-badge"> {badge} </span> {/if} </div>
</button> <style>
	.tab { padding: 0.5rem 1rem; border-bottom: 2px solid transparent; font-size: 0.875rem; font-weight: 500; white-space: nowrap; color: var(--color-gray-500); background: none; cursor: pointer; transition: all var(--transition-base); }

	.tab:hover:not(.disabled) { color: var(--color-gray-700); border-bottom-color: var(--color-gray-300); }

	.tab.active { border-bottom-color: var(--color-flame-500); color: var(--color-flame-600); }

	.tab.disabled { opacity: 0.5; cursor: not-allowed; }

	.tab-content { display: flex; align-items: center; }

	.tab-icon { margin-right: 0.5rem; }

	.tab-badge { margin-left: 0.5rem; display: inline-flex; align-items: center; padding: 0.125rem 0.5rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 500; background: var(--color-flame-100); color: var(--color-flame-800); }

</style>
