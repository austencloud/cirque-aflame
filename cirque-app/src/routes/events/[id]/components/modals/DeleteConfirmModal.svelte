<!-- src/routes/events/[id]/components/modals/DeleteConfirmModal.svelte -->
<script lang="ts">
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	interface Props {
		isLoading?: boolean;
		onconfirm?: () => void;
		oncancel?: () => void;
	}
	const { isLoading = false, onconfirm, oncancel }: Props = $props();
</script>

<div data-component="DeleteConfirmModal">
	<ConfirmDialog
		title="Delete Event"
		message="Are you sure you want to delete this event? This action cannot be undone."
		confirmText="Delete Event"
		confirmColor="red"
		{onconfirm}
		{oncancel}
		{isLoading}
	/>
</div>

<style>
	/* This component is a wrapper around ConfirmDialog */ /* No additional styles needed as ConfirmDialog handles all styling */
</style>
