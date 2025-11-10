<!-- src/routes/events/[id]/components/tabs/NotesTab.svelte -->
<script lang="ts"> import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte'; interface Props { event?: any; canEdit?: boolean; oneditNotes?: () => void; }

	const { event, canEdit = false, oneditNotes }: Props = $props();

	function handleEditNotes() { oneditNotes?.(); } </script>

<div class="notes-card" data-component="NotesTab"> <div class="notes-header"> <h2 class="notes-title">Event Notes</h2> {#if canEdit} <Button variant="outline" onclick={handleEditNotes}> {#snippet children()} <Icon name="edit" size={16} extraClass="mr-1" /> Edit Notes {/snippet} </Button> {/if} </div> {#if event.notes} <div class="notes-content"> {event.notes} </div> {:else} <div class="notes-empty"> <p class="empty-text">No notes have been added for this event.</p> {#if canEdit} <Button class="empty-button" onclick={handleEditNotes}> {#snippet children()}Add Notes{/snippet} </Button> {/if} </div> {/if} </div> <style>
	.notes-card { background: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow-sm); padding: 1rem; }

	.notes-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }

	.notes-title { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); }

	.notes-content { white-space: pre-line; padding: 1rem; background: var(--surface-secondary); border-radius: var(--border-radius); min-height: 12.5rem; color: var(--text-primary); line-height: 1.6; }

	.notes-empty { padding: 2rem; text-align: center; background: var(--surface-secondary); border-radius: var(--border-radius); min-height: 12.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }

	.empty-text { color: var(--text-secondary); }

	:global(.dark) .notes-card { background: var(--surface-color-dark); }

	:global(.dark) .notes-title, :global(.dark) .notes-content { color: var(--text-primary-dark); }

	:global(.dark) .notes-content, :global(.dark) .notes-empty { background: var(--surface-secondary-dark); }

	:global(.dark) .empty-text { color: var(--text-secondary-dark); }

</style>
