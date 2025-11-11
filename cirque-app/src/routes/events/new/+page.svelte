<script lang="ts">
	import { goto } from '$app/navigation';
	import { events } from '$lib/state/events.svelte';
	import EventForm from '$lib/components/events/EventForm.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Event } from '$lib/types';

	let isSubmitting = $state(false);

	async function handleSubmit(eventData: Partial<Event>) {
		isSubmitting = true;
		try {
			const newEvent = await events.addEvent(eventData);
			// Navigate directly to the newly created event's page
			goto(`/events/${newEvent.id}`);
		} catch (error) {
			console.error('Error creating event:', error);
			alert('Failed to create event. Please try again.');
			isSubmitting = false;
		}
	}

	function handleCancel() {
		// Navigate back to events list
		goto('/events');
	}
</script>

<svelte:head>
	<title>New Event | Ringmaster</title>
</svelte:head>

<div class="page-container">
	<!-- Header with back button -->
	<div class="page-header">
		<button type="button" class="back-button" onclick={handleCancel}>
			<Icon name="arrow-left" size={20} />
			<span>Back to Events</span>
		</button>
		<h1 class="page-title">Create New Event</h1>
	</div>

	<!-- Event Form -->
	<div class="form-wrapper glass">
		<EventForm
			submitLabel="Create Event"
			isLoading={isSubmitting}
			showCancelButton={true}
			onsubmit={handleSubmit}
			oncancel={handleCancel}
		/>
	</div>
</div>

<style>
	.page-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		min-height: 100vh;
	}

	@media (min-width: 640px) {
		.page-container {
			padding: 2rem 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.page-container {
			padding: 2.5rem 2rem;
		}
	}

	/* Page Header */
	.page-header {
		margin-bottom: 2rem;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		margin-bottom: 1.25rem;
		background: rgba(31, 41, 55, 0.5);
		border: 1px solid var(--color-gray-700);
		border-radius: var(--radius-lg);
		color: var(--color-gray-200);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.back-button:hover {
		background: var(--color-gray-700);
		border-color: var(--color-royal-400);
		color: white;
		transform: translateX(-2px);
	}

	.back-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.4);
		border-color: var(--color-royal-500);
	}

	.back-button:active {
		transform: translateX(-1px);
	}

	.page-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: white;
		margin: 0;
		letter-spacing: -0.025em;
	}

	@media (max-width: 640px) {
		.page-title {
			font-size: 2rem;
		}
	}

	/* Form Wrapper */
	.form-wrapper {
		padding: 2.5rem;
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-soft-lg);
		background: rgba(31, 41, 55, 0.4);
		border: 1px solid rgba(75, 85, 99, 0.3);
	}

	@media (max-width: 640px) {
		.form-wrapper {
			padding: 1.5rem;
		}
	}

	/* Enhanced form element styles for better readability */
	:global(.form-wrapper input[type="text"]),
	:global(.form-wrapper input[type="email"]),
	:global(.form-wrapper input[type="tel"]),
	:global(.form-wrapper input[type="date"]),
	:global(.form-wrapper input[type="time"]),
	:global(.form-wrapper input[type="number"]),
	:global(.form-wrapper textarea),
	:global(.form-wrapper select) {
		background: rgba(17, 24, 39, 0.6) !important;
		border: 1.5px solid var(--color-gray-700) !important;
		color: white !important;
		font-size: 0.9375rem !important;
		padding: 0.75rem 1rem !important;
	}

	:global(.form-wrapper input[type="text"]::placeholder),
	:global(.form-wrapper input[type="email"]::placeholder),
	:global(.form-wrapper input[type="tel"]::placeholder),
	:global(.form-wrapper textarea::placeholder) {
		color: var(--color-gray-500) !important;
	}

	:global(.form-wrapper input:focus),
	:global(.form-wrapper textarea:focus),
	:global(.form-wrapper select:focus) {
		outline: none !important;
		border-color: var(--color-royal-500) !important;
		box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.25) !important;
		background: rgba(17, 24, 39, 0.8) !important;
	}

	/* Form labels */
	:global(.form-wrapper label) {
		color: #f3f4f6 !important;
		font-size: 0.875rem !important;
		font-weight: 600 !important;
		margin-bottom: 0.5rem !important;
		display: block !important;
	}

	/* Section headings */
	:global(.form-wrapper h2),
	:global(.form-wrapper h3) {
		color: white !important;
		font-weight: 700 !important;
		letter-spacing: -0.015em !important;
	}

	:global(.form-wrapper h2) {
		font-size: 1.5rem !important;
		margin-bottom: 1.5rem !important;
	}

	:global(.form-wrapper h3) {
		font-size: 1.125rem !important;
	}

	/* Checkboxes and radio buttons */
	:global(.form-wrapper input[type="checkbox"]),
	:global(.form-wrapper input[type="radio"]) {
		width: 1.125rem !important;
		height: 1.125rem !important;
		cursor: pointer !important;
	}

	:global(.form-wrapper input[type="checkbox"]:focus),
	:global(.form-wrapper input[type="radio"]:focus) {
		outline: none !important;
		box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.4) !important;
	}

	/* Disabled states */
	:global(.form-wrapper input:disabled),
	:global(.form-wrapper textarea:disabled),
	:global(.form-wrapper select:disabled) {
		opacity: 0.5 !important;
		cursor: not-allowed !important;
	}

	/* Help text and descriptions */
	:global(.form-wrapper .help-text),
	:global(.form-wrapper .description) {
		color: var(--color-gray-400) !important;
		font-size: 0.8125rem !important;
		line-height: 1.5 !important;
	}

	/* Error states */
	:global(.form-wrapper .error),
	:global(.form-wrapper .error-message) {
		color: #f87171 !important;
		font-size: 0.8125rem !important;
		margin-top: 0.375rem !important;
	}

	:global(.form-wrapper input.error),
	:global(.form-wrapper textarea.error),
	:global(.form-wrapper select.error) {
		border-color: #ef4444 !important;
	}
</style>
