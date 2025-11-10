<!-- src/routes/events/[id]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { events } from '$lib/state/events.svelte';
	import { clients } from '$lib/state/clients.svelte';
	import { performers } from '$lib/state/performers.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import type { EventStatus } from '$lib/types';
	import EventHeader from './components/EventHeader.svelte';
	import EventTabs from './components/EventTabs.svelte';
	import EventForm from '$lib/components/events/EventForm.svelte';

	// State management
	let loading = $state(true);
	let activeTab = $state('details');
	let showEditModal = $state(false);
	let showDeleteConfirm = $state(false);
	let isDeleting = $state(false);
	let showEditNotesModal = $state(false);
	let notesForEditing = $state('');

	// All functionality is now accessible without authentication
	const canEdit = true;

	// Reactive values
	const eventId = $derived($page.params.id);
	const isNewEvent = $derived(eventId === 'new');	// Load data using $effect
	$effect(() => {
		async function loadData() {
			if (isNewEvent) {
				// It's a new event, don't load data, just finish loading state
				loading = false;
				return;
			}

			// Existing event logic
			try {
				// Load data
				await Promise.all([
					events.loadEvent(eventId),
					events.loadPerformersForEvent(eventId)
				]);

				if (events.selectedEvent?.client) {
					await clients.loadClient(events.selectedEvent.client);
				}
			} catch (error) {
				console.error('Error loading event data:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Reactive variables
	const event = $derived(events.selectedEvent);
	const client = $derived(clients.selectedClient);
	const eventPerformers = $derived(events.eventPerformers);

	// Handler functions
	async function handleDelete() {
		if (!event || isNewEvent) {
			return;
		}

		isDeleting = true;
		try {
			await events.deleteEvent(event.id);
			window.location.href = '/events';
		} catch (error) {
			console.error('Error deleting event:', error);
			isDeleting = false;
			showDeleteConfirm = false;
		}
	}

	async function handleStatusChange(newStatus: string) {
		if (!event || isNewEvent) {
			return;
		}

		try {
			await events.updateEvent(event.id, { status: newStatus as EventStatus });
		} catch (error) {
			console.error('Error updating event status:', error);
		}
	}

	async function handleEventFormSubmit(submittedData: any) {
		try {
			if (isNewEvent) {
				// Create new event logic
				const newEventId = await events.addEvent(submittedData);
				// Navigate to the newly created event's page
				window.location.href = `/events/${newEventId}`;
			} else if (event) {
				// Update existing event logic
				await events.updateEvent(event.id, submittedData);
				showEditModal = false;
			}
		} catch (error) {
			console.error('Error saving event:', error);
		}
	}

	async function handleNotesUpdate(notes: string) {
		if (!event || isNewEvent) {
			return;
		}

		await events.updateEvent(event.id, { notes });
		showEditNotesModal = false;
	}

	// Update notesForEditing when the modal opens
	$effect(() => {
		if (event && showEditNotesModal) {
			notesForEditing = event.notes || '';
		}
	});
</script>

<svelte:head>
	<title>{isNewEvent ? 'New Event' : (event?.name || 'Event Details')} | CircusSync</title>
</svelte:head>

<div data-page="event-detail">
	{#if loading}
		<div class="loading-container">
			<LoadingSpinner size="lg" />
		</div>
	{:else if !event && !isNewEvent}
		<div class="not-found-container">
			<h1 class="not-found-title">Event Not Found</h1>
			<p class="not-found-text">
				The event you're looking for doesn't exist or you don't have permission to view it.
			</p>
			<Button href="/events">
				{#snippet children()}Back to Events{/snippet}
			</Button>
		</div>
	{:else}
		<!-- Event Header: Conditionally render or pass isNewEvent -->
		{#if !isNewEvent && event}
			<EventHeader
				{event}
				{canEdit}
				onedit={() => (showEditModal = true)}
				ondelete={() => (showDeleteConfirm = true)}
				onstatuschange={(newStatus) => handleStatusChange(newStatus)}
			/>
		{:else if isNewEvent}
			<!-- Header for new events -->
			<div class="new-event-header">
				<h1 class="new-event-title">Create New Event</h1>
			</div>
		{/if}

		<!-- Tabs Navigation: Conditionally render or adjust based on isNewEvent -->
		{#if !isNewEvent && event}
			<EventTabs {activeTab} ontabchange={(tab) => (activeTab = tab)} />
		{/if}

		<!-- Main Content Area: Render form directly for new event, or tabs for existing -->
		{#if isNewEvent}
			<!-- Render EventForm directly for creating a new event -->
			<div class="new-event-form">
				<EventForm
					event={null}
					onsubmit={(e) => handleEventFormSubmit(e)}
					submitLabel="Create Event"
					showCancelButton={true}
					oncancel={() => window.history.back()}
				/>
			</div>
		{:else if event}
			<!-- Tab Content for existing event -->
			<div class="event-tabs-content">
				{#if activeTab === 'details'}
					<!-- DetailsTab content -->
				{:else if activeTab === 'client'}
					<!-- ClientInfoTab content -->
				{:else if activeTab === 'performers'}
					<!-- PerformersTab content -->
				{:else if activeTab === 'contract'}
					<!-- ContractTab content -->
				{:else if activeTab === 'notes'}
					<!-- NotesTab content -->
				{/if}
			</div>
		{/if}

		<!-- Modals: Ensure they handle the context (new vs. edit) if necessary -->
		{#if showEditModal && event && !isNewEvent}
			<!-- EditEventModal content -->
		{/if}

		{#if showDeleteConfirm && event && !isNewEvent}
			<!-- DeleteConfirmModal content -->
		{/if}

		{#if showEditNotesModal && event && !isNewEvent}
			<!-- EditNotesModal content -->
		{/if}
	{/if}
</div>

<style>
	/* Loading State */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 16rem;
		padding: 3rem 1rem;
	}

	/* Not Found State */
	.not-found-container {
		padding: 1.5rem;
		text-align: center;
	}

	.not-found-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-red-600);
		margin: 0 0 0.5rem 0;
	}

	.not-found-text {
		color: var(--color-gray-600);
		margin: 0 0 1rem 0;
	}

	:global(.dark) .not-found-text {
		color: var(--color-gray-400);
	}

	/* New Event Header */
	.new-event-header {
		padding: 1.5rem 1rem;
		background: white;
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .new-event-header {
		background: var(--color-gray-800);
		border-bottom-color: var(--color-gray-700);
	}

	.new-event-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-gray-900);
		margin: 0;
	}

	:global(.dark) .new-event-title {
		color: var(--color-gray-100);
	}

	/* New Event Form */
	.new-event-form {
		margin-top: 1.5rem;
		padding: 0 1rem;
	}

	@media (min-width: 640px) {
		.new-event-form {
			padding: 0 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.new-event-form {
			padding: 0 2rem;
		}
	}

	/* Event Tabs Content */
	.event-tabs-content {
		margin-top: 1.5rem;
		padding: 0 1rem;
	}

	@media (min-width: 640px) {
		.event-tabs-content {
			padding: 0 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.event-tabs-content {
			padding: 0 2rem;
		}
	}
</style>
