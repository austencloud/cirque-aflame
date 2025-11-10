<script lang="ts">
	interface Props {
		formData: any;
	}
	let { formData = $bindable() }: Props = $props();
</script>

<div class="notes-container" data-component="NotesSection">
	<h3 class="notes-title">Event Notes</h3>
	<textarea
		id="notes"
		bind:value={formData.notes}
		rows="4"
		class="form-input notes-textarea"
		placeholder="Add any internal notes about this event..."
	></textarea>
</div>

<style>
	.notes-container {
		padding: 0;
	}
	.notes-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-gray-900);
		margin-bottom: 1rem;
	}
	:global(.dark) .notes-title {
		color: var(--color-gray-100);
	}
	.notes-textarea {
		resize: vertical;
		min-height: 6rem;
	}
</style>
