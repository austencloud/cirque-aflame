<script lang="ts">
	import Sheet from '$lib/components/ui/Sheet.svelte';
	import { events } from '$lib/state/events.svelte';
	import EventForm from './EventForm.svelte';
	import type { Event } from '$lib/types';

	interface Props {
		show: boolean;
		onclose: () => void;
		preselectedClientId?: string | null;
		preselectedPerformerId?: string | null;
	}

	const { 
		show = false, 
		onclose,
		preselectedClientId = null,
		preselectedPerformerId = null
	}: Props = $props();

	let isCreating = $state(false);
	let draftEvent: Partial<Event> | null = null;
	let renderForm = $state(false);

	// Delay form rendering to allow Sheet animation to start
	$effect(() => {
		if (show) {
			// Small delay to let the Sheet transition start
			setTimeout(() => {
				renderForm = true;
			}, 50);
		} else {
			renderForm = false;
		}
	});

	// Handle form submission
	async function handleSubmit(data: Partial<Event>) {
		isCreating = true;
		try {
			await events.addEvent(data as Omit<Event, 'id' | 'createdAt' | 'updatedAt'>);
			draftEvent = null; // Clear draft on successful creation
			onclose();
		} catch (error) {
			console.error('Error creating event:', error);
		} finally {
			isCreating = false;
		}
	}

	// Handle panel close with draft saving
	function handleClose() {
		// Save draft logic could go here if needed
		// For now, just close
		onclose();
	}
</script>

<Sheet isOpen={show} onclose={handleClose} title="Create New Event" size="full">
	{#snippet children()}
		{#if renderForm}
			<EventForm
				submitLabel="Create Event"
				isLoading={isCreating}
				showCancelButton={true}
				{preselectedClientId}
				{preselectedPerformerId}
				onsubmit={handleSubmit}
				oncancel={handleClose}
			/>
		{/if}
	{/snippet}
</Sheet>
