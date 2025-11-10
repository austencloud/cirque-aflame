<!-- src/lib/components/contracts/+page.svelte -->
<script lang="ts">
	import { events } from '$lib/state/events.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { format } from 'date-fns';

	const { page } = $props<{ page: any }>();

	// State
	let loading = $state(true);
	let searchQuery = $state('');
	let filterStatus = $state<'all' | 'sent' | 'received' | 'pending'>('all');

	// Load events (contracts are part of events)
	$effect(() => {
		async function loadData() {
			try {
				await events.loadEvents();
			} catch (error) {
				console.error('Error loading events:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Filtered events with contracts
	const filteredEvents = $derived(
		events.events.filter((event) => {
			// Search filter
			if (searchQuery) {
				const search = searchQuery.toLowerCase();
				if (!event.name.toLowerCase().includes(search)) {
					return false;
				}
			}

			// Status filter
			if (filterStatus === 'sent' && !event.contract?.sent) {
				return false;
			}
			if (filterStatus === 'received' && !event.contract?.received) {
				return false;
			}
			if (filterStatus === 'pending' && (event.contract?.sent || event.contract?.received)) {
				return false;
			}

			return true;
		})
	);

	// Sort by date
	const sortedEvents = $derived(
		[...filteredEvents].sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
	);

	function getContractStatus(event: any): { text: string; color: string; badgeClass: string } {
		if (event.contract?.received) {
			return { text: 'Received', color: 'text-green-400', badgeClass: 'status-badge-success' };
		}
		if (event.contract?.sent) {
			return { text: 'Sent', color: 'text-blue-400', badgeClass: 'status-badge-info' };
		}
		return { text: 'Pending', color: 'text-amber-400', badgeClass: 'status-badge-warning' };
	}
</script>

<div class="page-container">
	<div class="page-header">
		<h1 class="page-title">Contracts</h1>
		<Button onclick={() => (window.location.href = '/events')}>
			{#snippet children()}
				<Icon name="calendar" size={18} extraClass="mr-1" />
				View Events
			{/snippet}
		</Button>
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
					bind:value={searchQuery}
					placeholder="Search by event name..."
					class="search-input"
				/>
			</div>

			<!-- Status Filter -->
			<div class="filter-wrapper">
				<select bind:value={filterStatus} class="filter-select">
					<option value="all">All Contracts</option>
					<option value="pending">Pending</option>
					<option value="sent">Sent</option>
					<option value="received">Received</option>
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
			<Icon name="file-text" size={48} extraClass="empty-icon" />
			<h3 class="empty-title">No contracts found</h3>
			<p class="empty-description">
				{searchQuery || filterStatus !== 'all'
					? 'Try adjusting your filters.'
					: 'Contracts are managed through events.'}
			</p>
			<Button onclick={() => (window.location.href = '/events')}>
				{#snippet children()}
					<Icon name="calendar" size={18} extraClass="mr-1" />
					Go to Events
				{/snippet}
			</Button>
		</div>
	{:else}
		<div class="contracts-list">
			{#each sortedEvents as event (event.id)}
				<a href="/events/{event.id}" class="contract-card card-base card-hover">
					<div class="contract-header">
						<div class="contract-info">
							<h3 class="contract-name">{event.name}</h3>
							<div class="contract-meta">
								<Icon name="calendar" size={16} extraClass="meta-icon" />
								<span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
							</div>
							{#if event.client}
								<div class="contract-meta">
									<Icon name="user" size={16} extraClass="meta-icon" />
									<span>Client ID: {event.client}</span>
								</div>
							{/if}
						</div>
						<div class="contract-status">
							<span class="status-badge {getContractStatus(event).badgeClass}">
								{getContractStatus(event).text}
							</span>
							<div class="chevron-icon">
								<Icon name="chevron-right" size={20} />
							</div>
						</div>
					</div>

					<!-- Contract Details -->
					<div class="contract-details">
						<div class="detail-item">
							<Icon
								name={event.contract?.sent ? 'check-circle' : 'circle'}
								size={16}
								extraClass="detail-icon {event.contract?.sent ? 'text-green-400' : 'text-gray-600'}"
							/>
							<span class={event.contract?.sent ? 'text-green-400' : 'text-gray-400'}>
								Contract Sent
							</span>
						</div>
						<div class="detail-item">
							<Icon
								name={event.contract?.received ? 'check-circle' : 'circle'}
								size={16}
								extraClass="detail-icon {event.contract?.received ? 'text-green-400' : 'text-gray-600'}"
							/>
							<span class={event.contract?.received ? 'text-green-400' : 'text-gray-400'}>
								Contract Received
							</span>
						</div>
					</div>

					{#if event.contract?.url}
						<div class="contract-footer">
							<Icon name="file-text" size={16} extraClass="footer-icon" />
							<span>Contract document available</span>
						</div>
					{/if}
				</a>
			{/each}
		</div>

		<!-- Results count -->
		<div class="results-count">
			Showing {sortedEvents.length}
			{sortedEvents.length === 1 ? 'contract' : 'contracts'}
			{#if searchQuery || filterStatus !== 'all'}
				(filtered)
			{/if}
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

	.empty-icon {
		color: var(--color-gray-600);
		margin: 0 auto 1rem;
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

	/* Contracts List */
	.contracts-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Contract Card */
	.contract-card {
		border-radius: var(--radius-2xl);
		overflow: hidden;
		text-decoration: none;
		display: block;
		transition: all var(--transition-base);
	}

	.contract-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-gray-700);
		gap: 1rem;
	}

	.contract-info {
		flex: 1;
		min-width: 0;
	}

	.contract-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-royal-400);
		margin: 0 0 0.5rem 0;
		word-wrap: break-word;
	}

	.contract-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-gray-400);
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
	}

	.meta-icon {
		flex-shrink: 0;
	}

	.contract-status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
	}

	/* Status Badge */
	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.status-badge-success {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.status-badge-info {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	.status-badge-warning {
		background: rgba(245, 158, 11, 0.15);
		color: #fbbf24;
		border: 1px solid rgba(245, 158, 11, 0.3);
	}

	.chevron-icon {
		color: var(--color-gray-500);
	}

	/* Contract Details */
	.contract-details {
		padding: 1rem 1.5rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	@media (min-width: 640px) {
		.contract-details {
			grid-template-columns: 1fr 1fr;
		}
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.detail-icon {
		flex-shrink: 0;
	}

	/* Contract Footer */
	.contract-footer {
		padding: 0.75rem 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(17, 24, 39, 0.5);
		color: var(--color-royal-400);
		font-size: 0.875rem;
	}

	.footer-icon {
		flex-shrink: 0;
	}

	/* Results Count */
	.results-count {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-gray-400);
	}
</style>
