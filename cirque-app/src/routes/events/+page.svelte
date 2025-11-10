<script lang="ts">
	import { format } from 'date-fns';
	import { events } from '$lib/state/events.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	// State management
	let loading = $state(true);
	let searchTerm = $state('');
	let filterStatus = $state('all');
	let currentView = $state('list'); // 'list' or 'calendar'

	// All functionality is now accessible without authentication
	const canManageEvents = true;

	// Status filter options
	const statusOptions = [
		{ value: 'all', label: 'All Events' },
		{ value: 'upcoming', label: 'Upcoming' },
		{ value: 'inquiry', label: 'Inquiries' },
		{ value: 'confirmed', label: 'Confirmed' },
		{ value: 'deposit-received', label: 'Deposit Received' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'cancelled', label: 'Cancelled' }
	];

	// Initialize page
	$effect(() => {
		async function loadData() {
			try {
				// Load all events
				await events.loadEvents();
			} catch (error) {
				console.error('Error loading events:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Reactive filtered events - Svelte 5 $derived
	const filteredEvents = $derived(
		events.events.filter((event) => {
			// First apply status filter
			if (filterStatus !== 'all') {
				if (filterStatus === 'upcoming') {
					// For upcoming, check date
					const today = new Date();
					// Ensure event date is valid before comparison
					if (!(event.date instanceof Date) || isNaN(event.date.getTime())) {
						return false;
					}
					if (
						event.date < today ||
						event.status === 'cancelled' ||
						event.status === 'completed'
					) {
						return false;
					}
				} else if (event.status !== filterStatus) {
					return false;
				}
			}

			// Then apply search filter if any
			if (searchTerm) {
				const search = searchTerm.toLowerCase();
				return (
					event.name.toLowerCase().includes(search) ||
					(event.location?.address && event.location.address.toLowerCase().includes(search)) ||
					(event.clientLiaison && event.clientLiaison.toLowerCase().includes(search)) ||
					(event.gigManager && event.gigManager.toLowerCase().includes(search))
				);
			}

			return true;
		})
	);

	// Sort events by date (this was already correct, added date validation)
	const sortedEvents = $derived(
		[...filteredEvents].sort((a, b) => {
			// Get current date
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Normalize today to the start of the day for comparisons

			// Ensure dates are valid Date objects
			const dateA =
				a.date instanceof Date && !isNaN(a.date.getTime()) ? a.date : new Date(0); // Use epoch if invalid
			const dateB =
				b.date instanceof Date && !isNaN(b.date.getTime()) ? b.date : new Date(0); // Use epoch if invalid

			const isAPast = dateA < today;
			const isBPast = dateB < today;

			// If both dates are in the past
			if (isAPast && isBPast) {
				// Sort descending (most recent first)
				return dateB.getTime() - dateA.getTime();
			}

			// If both dates are today or in the future
			if (!isAPast && !isBPast) {
				// Sort ascending (soonest first)
				return dateA.getTime() - dateB.getTime();
			}

			// If one is past and one is future, future comes first
			return isAPast ? 1 : -1;
		})
	);

	// Helper functions
	function getStatusColor(
		status: string
	): 'blue' | 'green' | 'red' | 'amber' | 'gray' | 'purple' | undefined {
		switch (status) {
			case 'confirmed':
				return 'green';
			case 'deposit-received':
				return 'blue';
			case 'inquiry':
				return 'gray';
			case 'completed':
				return 'purple';
			case 'cancelled':
				return 'red';
			default:
				return 'gray';
		}
	}

	function getStatusText(status: string): string {
		switch (status) {
			case 'deposit-received':
				return 'Deposit Received';
			default:
				// Handle potential null/undefined status gracefully
				return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
		}
	}

	function isEventUpcoming(date: Date | undefined | null): boolean {
		if (!(date instanceof Date) || isNaN(date.getTime())) {
			return false;
		} // Handle invalid dates
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Compare against the start of today
		return date >= today;
	}

	function formatEventDate(date: Date | undefined | null): string {
		if (!(date instanceof Date) || isNaN(date.getTime())) {
			return 'Invalid Date';
		} // Handle invalid dates
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		// Normalize dates to compare day only
		const eventDateStr = date.toDateString();
		const todayStr = today.toDateString();
		const tomorrowStr = tomorrow.toDateString();

		if (eventDateStr === todayStr) {
			return 'Today';
		} else if (eventDateStr === tomorrowStr) {
			return 'Tomorrow';
		} else {
			// Use date-fns format - ensure date is valid
			return format(date, 'MMM d, yyyy');
		}
	}
</script>

<svelte:head>
	<title>Events | CircusSync</title>
</svelte:head>

<div class="page-container">
	<div class="page-header">
		<h1 class="page-title">Events</h1>
		<div class="header-actions">
			<div class="view-toggle-group" role="group">
				<button
					type="button"
					class="view-toggle-button {currentView === 'list' ? 'view-toggle-active' : ''}"
					onclick={() => (currentView = 'list')}
				>
					<Icon name="list" size={18} />
					<span>List</span>
				</button>
				<button
					type="button"
					class="view-toggle-button view-toggle-button-right {currentView === 'calendar'
						? 'view-toggle-active'
						: ''}"
					onclick={() => (currentView = 'calendar')}
				>
					<Icon name="calendar" size={18} />
					<span>Calendar</span>
				</button>
			</div>
			{#if canManageEvents}
				<Button href="/events/new">
					{#snippet children()}
						<Icon name="plus" size={18} extraClass="mr-1" />
						New Event
					{/snippet}
				</Button>
			{/if}
		</div>
	</div>

	<!-- Filters Panel -->
	<div class="filters-panel glass">
		<div class="filters-grid">
			<!-- Search -->
			<div class="search-wrapper">
				<div class="search-icon">
					<Icon name="search" size={20} extraClass="text-gray-400" />
				</div>
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Search events..."
					class="search-input"
				/>
			</div>

			<!-- Status Filter -->
			<div class="filter-wrapper">
				<select bind:value={filterStatus} class="filter-select">
					{#each statusOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="loading-container">
			<LoadingSpinner size="lg" />
		</div>
	{:else if sortedEvents.length === 0}
		<div class="empty-state glass">
			<Icon name="calendar" size={48} extraClass="empty-icon" />
			<h3 class="empty-title">No events found</h3>
			<p class="empty-description">
				{searchTerm
					? `No events matching "${searchTerm}"`
					: filterStatus !== 'all'
						? `No ${statusOptions.find((o) => o.value === filterStatus)?.label || filterStatus} events found`
						: 'You have no events yet'}
			</p>
			{#if canManageEvents}
				<Button href="/events/new">
					{#snippet children()}
						<Icon name="plus" size={18} extraClass="mr-1" />
						Create an Event
					{/snippet}
				</Button>
			{/if}
		</div>
	{:else if currentView === 'list'}
		<div class="events-list">
			{#each sortedEvents as event (event.id)}
				<a href="/events/{event.id}" class="event-card card-base card-hover">
					<div class="event-header">
						<div class="event-info">
							<h3 class="event-name">{event.name || 'Unnamed Event'}</h3>
							<div
								class="event-date {isEventUpcoming(event.date)
									? 'event-date-upcoming'
									: 'event-date-past'}"
							>
								<Icon name="calendar" size={14} extraClass="mr-1" />
								{formatEventDate(event.date)}
							</div>
						</div>
						<div class="event-status">
							<Badge color={getStatusColor(event.status)}>
								{#snippet children()}{getStatusText(event.status)}{/snippet}
							</Badge>
						</div>
					</div>
					<div class="event-details">
						<div class="detail-item">
							<Icon name="map-pin" size={16} extraClass="detail-icon" />
							<span>{event.location?.address?.split(',')[0] || 'No location'}</span>
						</div>
						<div class="detail-item">
							<Icon name="clock" size={16} extraClass="detail-icon" />
							<span
								>{event.performanceTime?.start || 'N/A'} - {event.performanceTime?.end ||
									'N/A'}</span
							>
						</div>
						<div class="detail-item">
							<Icon name="users" size={16} extraClass="detail-icon" />
							<span>{event.performers?.length || 0} performers</span>
						</div>
					</div>
					<div class="event-footer">
						<Icon name="dollar-sign" size={16} extraClass="footer-icon" />
						<span>${event.payment?.totalValue?.toFixed(2) || '0.00'}</span>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="calendar-view glass">
			<Icon name="calendar" size={48} extraClass="calendar-placeholder-icon" />
			<h3 class="calendar-placeholder-title">Calendar View</h3>
			<p class="calendar-placeholder-text">
				Calendar view implementation is pending. Displaying events for April 2025 as a placeholder.
			</p>
			<div class="calendar-widget">
				<div class="calendar-header">
					<div class="calendar-header-content">
						<h2 class="calendar-month">April 2025</h2>
						<div class="calendar-controls">
							<button class="calendar-nav-button">
								<Icon name="chevron-left" size={20} />
							</button>
							<button class="calendar-nav-button">
								<Icon name="chevron-right" size={20} />
							</button>
							<button class="calendar-today-button"> Today </button>
						</div>
					</div>
				</div>
				<div class="calendar-grid">
					{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
						<div class="calendar-day-header">
							{day}
						</div>
					{/each}
					{#each Array(35) as _, i}
						{@const dayNum = i - 2}
						{@const isCurrentMonth = dayNum > 0 && dayNum <= 30}
						{@const isTodayPlaceholder = dayNum === 18}
						<div class="calendar-day {isCurrentMonth ? '' : 'calendar-day-inactive'}">
							{#if isCurrentMonth}
								<span
									class="calendar-day-number {isTodayPlaceholder ? 'calendar-day-today' : ''}"
								>
									{dayNum}
								</span>
								{#if dayNum === 6}
									<div class="calendar-event calendar-event-blue">Event Placeholder</div>
								{/if}
								{#if dayNum === 14}
									<div class="calendar-event calendar-event-green">Another Event</div>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Page Container */
	.page-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
	}

	@media (min-width: 640px) {
		.page-container {
			padding: 1.5rem 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.page-container {
			padding: 2rem 2rem;
		}
	}

	/* Page Header */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.page-title {
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--color-gray-100);
		margin: 0;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* View Toggle */
	.view-toggle-group {
		display: inline-flex;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--color-gray-700);
	}

	.view-toggle-button {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		background: var(--color-gray-800);
		color: var(--color-gray-400);
		border: none;
		border-right: 1px solid var(--color-gray-700);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.view-toggle-button-right {
		border-right: none;
	}

	.view-toggle-button:hover {
		background: var(--color-gray-700);
		color: var(--color-gray-100);
	}

	.view-toggle-button:focus {
		outline: none;
		box-shadow: inset 0 0 0 2px rgba(168, 85, 247, 0.3);
	}

	.view-toggle-active {
		background: var(--color-royal-600);
		color: white;
	}

	.view-toggle-active:hover {
		background: var(--color-royal-500);
		color: white;
	}

	/* Filters Panel */
	.filters-panel {
		padding: 1.5rem;
		border-radius: var(--radius-2xl);
		margin-bottom: 2rem;
		box-shadow: var(--shadow-soft-lg);
	}

	.filters-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.filters-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Search Input */
	.search-wrapper {
		position: relative;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.625rem 0.75rem 0.625rem 2.5rem;
		border: 1px solid var(--color-gray-700);
		border-radius: var(--radius-lg);
		background: var(--color-gray-800);
		color: var(--color-gray-100);
		font-size: 0.875rem;
		transition: all var(--transition-fast);
	}

	.search-input::placeholder {
		color: var(--color-gray-500);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-royal-500);
		box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
	}

	/* Filter Select */
	.filter-wrapper {
		position: relative;
	}

	.filter-select {
		width: 100%;
		padding: 0.625rem 2.5rem 0.625rem 0.75rem;
		border: 1px solid var(--color-gray-700);
		border-radius: var(--radius-lg);
		background: var(--color-gray-800);
		color: var(--color-gray-100);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all var(--transition-fast);
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--color-royal-500);
		box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
	}

	/* Loading State */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 4rem 0;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-soft-lg);
	}

	.empty-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0 0 0.5rem 0;
	}

	.empty-description {
		color: var(--color-gray-400);
		margin: 0 0 1.5rem 0;
	}

	/* Events List */
	.events-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Event Card */
	.event-card {
		border-radius: var(--radius-2xl);
		overflow: hidden;
		text-decoration: none;
		display: block;
		transition: all var(--transition-base);
	}

	.event-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-gray-700);
		gap: 1rem;
	}

	.event-info {
		flex: 1;
		min-width: 0;
	}

	.event-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-royal-400);
		margin: 0 0 0.5rem 0;
		word-wrap: break-word;
	}

	.event-date {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
		width: fit-content;
	}

	.event-date-upcoming {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.event-date-past {
		background: rgba(107, 114, 128, 0.15);
		color: var(--color-gray-400);
		border: 1px solid rgba(107, 114, 128, 0.3);
	}

	.event-status {
		flex-shrink: 0;
	}

	/* Event Details */
	.event-details {
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	@media (min-width: 640px) {
		.event-details {
			flex-direction: row;
			gap: 1.5rem;
			flex-wrap: wrap;
		}
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-gray-400);
	}

	/* Event Footer */
	.event-footer {
		padding: 0.75rem 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(17, 24, 39, 0.5);
		color: var(--color-green-400);
		font-size: 0.875rem;
		font-weight: 600;
	}

	/* Calendar View */
	.calendar-view {
		border-radius: var(--radius-lg);
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		padding: 1.5rem;
		text-align: center;
	}

	:global(.calendar-placeholder-icon) {
		margin: 0 auto 1rem auto;
		color: var(--color-gray-400);
	}

	.calendar-placeholder-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-gray-900);
		margin: 0 0 0.25rem 0;
	}

	:global(.dark) .calendar-placeholder-title {
		color: var(--color-gray-100);
	}

	.calendar-placeholder-text {
		color: var(--color-gray-500);
		margin: 0 0 1rem 0;
	}

	.calendar-widget {
		margin-top: 1rem;
		border: 1px solid var(--color-gray-200);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.calendar-header {
		padding: 1rem;
		border-bottom: 1px solid var(--color-gray-200);
	}

	.calendar-header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.calendar-month {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-gray-900);
		margin: 0;
	}

	:global(.dark) .calendar-month {
		color: var(--color-gray-100);
	}

	.calendar-controls {
		display: flex;
		gap: 0.5rem;
	}

	.calendar-nav-button {
		padding: 0.25rem;
		border-radius: var(--radius-full);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.calendar-nav-button:hover {
		background: var(--color-gray-100);
	}

	.calendar-today-button {
		padding: 0.25rem;
		margin-left: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-royal-600);
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.calendar-today-button:hover {
		color: var(--color-royal-800);
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		background: var(--color-gray-200);
		border-top: 1px solid var(--color-gray-200);
	}

	.calendar-day-header {
		background: var(--color-gray-50);
		padding: 0.5rem;
		text-align: center;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-500);
	}

	.calendar-day {
		min-height: 6rem;
		background: white;
		padding: 0.25rem;
		position: relative;
	}

	.calendar-day-inactive {
		background: var(--color-gray-50);
		color: var(--color-gray-400);
	}

	.calendar-day-number {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		font-size: 0.75rem;
	}

	.calendar-day-today {
		background: var(--color-royal-500);
		color: white;
		border-radius: var(--radius-full);
		height: 1.25rem;
		width: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.calendar-event {
		margin-top: 1.5rem;
		font-size: 0.6rem;
		padding: 0.125rem;
		border-radius: var(--radius-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.calendar-event-blue {
		background: var(--color-royal-100);
		color: var(--color-royal-800);
	}

	.calendar-event-green {
		background: var(--color-green-100);
		color: var(--color-green-800);
	}
</style>
