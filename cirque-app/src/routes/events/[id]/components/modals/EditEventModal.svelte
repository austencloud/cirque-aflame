<!-- src/routes/events/[id]/components/modals/EditEventModal.svelte -->
<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import EventForm from '$lib/components/events/EventForm.svelte';

	interface Props {
		event?: any;
		onsubmit?: (data: any) => void;
		onclose?: () => void;
	}

	const { event, onsubmit, onclose }: Props = $props();

	function handleSubmit(data: any) {
		onsubmit?.(data);
	}

	function handleClose() {
		onclose?.();
	}
</script>

<div data-component="EditEventModal">
	<Modal title="Edit Event" onclose={handleClose} size="lg">
		{#snippet children()}
			<EventForm {event} onsubmit={handleSubmit} oncancel={handleClose} />
		{/snippet}
	</Modal>
</div>

<style>
	/* This component is a wrapper around Modal and EventForm */
	/* No additional styles needed as Modal and EventForm handle all styling */
</style>
