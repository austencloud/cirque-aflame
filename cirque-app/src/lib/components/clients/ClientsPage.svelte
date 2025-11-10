<!-- src/routes/clients/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { clients } from '$lib/state/clients.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import ClientForm from '$lib/components/clients/ClientForm.svelte';
	import type { Client } from '$lib/types';

	const { page } = $props<{ page: any }>();

	// State variables
	let loading = $state(true);
	let searchTerm = $state('');
	let statusFilter = $state('all');
	let showAddClientModal = $state(false);

	// All functionality is now accessible without authentication
	const canAddClient = true;

	// Get URL query parameters
	const urlFilter = $derived(page.url.searchParams.get('filter') || 'all');

	// Status filter options
	const statusOptions = [
		{ value: 'all', label: 'All Clients' },
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'lead', label: 'Leads' },
		{ value: 'yearly', label: 'Yearly' },
		{ value: 'follow-up', label: 'Need Follow-up' }
	];

	// Initialize page
	$effect(() => {
		async function loadData() {
			try {
				// Set the filter from URL if it exists
				if (urlFilter && urlFilter !== 'all') {
					statusFilter = urlFilter;
				}

				// Load clients based on filter
				if (statusFilter === 'follow-up') {
					await clients.loadFollowUpClients();
				} else if (statusFilter !== 'all') {
					// Type check to ensure statusFilter is a valid ClientStatus
					if (
						statusFilter === 'active' ||
						statusFilter === 'inactive' ||
						statusFilter === 'lead' ||
						statusFilter === 'yearly'
					) {
						await clients.loadClientsByStatus(statusFilter as ClientStatus);
					} else {
						// Fallback to loading all clients if status is invalid
						await clients.loadClients();
					}
				} else {
					await clients.loadClients();
				}
			} catch (error) {
				console.error('Error loading clients:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Filter clients based on search term
	const filteredClients = $derived(
		clients.clients.filter((client) => {
			if (!searchTerm) {
				return true;
			}
			const search = searchTerm.toLowerCase();
			return (
				client.name.toLowerCase().includes(search) ||
				client.contactPerson.toLowerCase().includes(search) ||
				client.email.toLowerCase().includes(search) ||
				client.phone.toLowerCase().includes(search)
			);
		})
	);

	// Sort clients alphabetically by name
	const sortedClients = $derived([...filteredClients].sort((a, b) => a.name.localeCompare(b.name)));

	// Define valid status types
	type ClientStatus = 'active' | 'inactive' | 'lead' | 'yearly';

	// Handle filter change
	async function handleFilterChange() {
		loading = true;
		try {
			// Update URL query parameter
			goto(`/clients?filter=${statusFilter}`, { replaceState: true });

			// Load clients based on filter
			if (statusFilter === 'follow-up') {
				await clients.loadFollowUpClients();
			} else if (statusFilter !== 'all') {
				// Type check to ensure statusFilter is a valid ClientStatus
				if (
					statusFilter === 'active' ||
					statusFilter === 'inactive' ||
					statusFilter === 'lead' ||
					statusFilter === 'yearly'
				) {
					await clients.loadClientsByStatus(statusFilter as ClientStatus);
				} else {
					// Fallback to loading all clients if status is invalid
					await clients.loadClients();
				}
			} else {
				await clients.loadClients();
			}
		} catch (error) {
			console.error('Error filtering clients:', error);
		} finally {
			loading = false;
		}
	}

	// Handle client add
	async function handleAddClient(clientData: Partial<Client>) {
		try {
			const clientId = await clients.addClient(
				clientData as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
			);
			showAddClientModal = false;

			// Refresh client list
			if (statusFilter !== 'all') {
				await clients.loadClients();
			}

			// Navigate to the new client
			goto(`/clients/${clientId}`);
		} catch (error) {
			console.error('Error adding client:', error);
		}
	}

	// Get status badge color
	function getStatusColor(
		status: string
	): 'blue' | 'green' | 'red' | 'amber' | 'gray' | 'purple' | undefined {
		switch (status) {
			case 'active':
				return 'green';
			case 'inactive':
				return 'gray';
			case 'lead':
				return 'blue';
			case 'yearly':
				return 'purple';
			default:
				return 'gray';
		}
	}
</script>

<svelte:head>
	<title>Clients | CircusSync</title>
</svelte:head>

<div class="page-container">
	<div class="page-header">
		<h1 class="page-title">Clients</h1>
		{#if canAddClient}
			<Button onclick={() => (showAddClientModal = true)}>
				{#snippet children()}
					<Icon name="plus" size={18} extraClass="mr-1" />
					Add Client
				{/snippet}
			</Button>
		{/if}
	</div>

	<!-- Filters Panel -->
	<div class="filters-panel glass">
		<div class="filters-grid">
			<!-- Search -->
			<div class="search-wrapper">
				<div class="search-icon">
					<Icon name="search" size={20} extraClass="text-gray-400" />
				</div>
				<input type="text" bind:value={searchTerm} placeholder="Search clients..." class="search-input" />
			</div>

			<!-- Status Filter -->
			<div class="filter-wrapper">
				<select bind:value={statusFilter} onchange={handleFilterChange} class="filter-select">
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
	{:else if sortedClients.length === 0}
		<div class="empty-state glass">
			<Icon name="users" size={48} extraClass="empty-icon" />
			<h3 class="empty-title">No clients found</h3>
			<p class="empty-description">
				{searchTerm
					? `No clients matching "${searchTerm}"`
					: statusFilter !== 'all'
						? `No ${statusFilter} clients found`
						: 'You have no clients yet'}
			</p>
			{#if canAddClient}
				<Button onclick={() => (showAddClientModal = true)}>
					{#snippet children()}
						<Icon name="plus" size={18} extraClass="mr-1" />
						Add Your First Client
					{/snippet}
				</Button>
			{/if}
		</div>
	{:else}
		<div class="clients-list">
			{#each sortedClients as client (client.id)}
				<a href="/clients/{client.id}" class="client-card card-base card-hover">
					<div class="client-header">
						<div class="client-info">
							<h3 class="client-name">{client.name}</h3>
							<p class="client-contact">{client.contactPerson}</p>
						</div>
						<div class="client-status">
							<Badge color={getStatusColor(client.status)}>
								{#snippet children()}{client.status.charAt(0).toUpperCase() +
									client.status.slice(1)}{/snippet}
							</Badge>
						</div>
					</div>

					<div class="client-details">
						{#if client.email}
							<div class="detail-item">
								<Icon name="mail" size={16} extraClass="detail-icon" />
								<span>{client.email}</span>
							</div>
						{/if}
						{#if client.phone}
							<div class="detail-item">
								<Icon name="phone" size={16} extraClass="detail-icon" />
								<span>{client.phone}</span>
							</div>
						{/if}
					</div>

					{#if client.nextFollowUp && client.nextFollowUp.date}
						<div class="client-footer follow-up">
							<Icon name="bell" size={16} extraClass="footer-icon" />
							<span>Follow-up needed</span>
						</div>
					{:else if client.lastContacted}
						<div class="client-footer">
							<Icon name="calendar" size={16} extraClass="footer-icon" />
							<span>Last contacted: {new Date(client.lastContacted).toLocaleDateString()}</span>
						</div>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>

<!-- Add Client Modal -->
{#if showAddClientModal}
	<Modal title="Add New Client" size="lg" onclose={() => (showAddClientModal = false)}>
		{#snippet children()}
			<ClientForm onsubmit={handleAddClient} oncancel={() => (showAddClientModal = false)} />
		{/snippet}
	</Modal>
{/if}

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

	/* Clients List */
	.clients-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Client Card */
	.client-card {
		border-radius: var(--radius-2xl);
		overflow: hidden;
		text-decoration: none;
		display: block;
		transition: all var(--transition-base);
	}

	.client-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-gray-700);
		gap: 1rem;
	}

	.client-info {
		flex: 1;
		min-width: 0;
	}

	.client-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-royal-400);
		margin: 0 0 0.25rem 0;
		word-wrap: break-word;
	}

	.client-contact {
		font-size: 0.875rem;
		color: var(--color-gray-400);
		margin: 0;
	}

	.client-status {
		flex-shrink: 0;
	}

	/* Client Details */
	.client-details {
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	@media (min-width: 640px) {
		.client-details {
			flex-direction: row;
			gap: 1.5rem;
		}
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-gray-400);
	}

	/* Client Footer */
	.client-footer {
		padding: 0.75rem 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(17, 24, 39, 0.5);
		color: var(--color-gray-400);
		font-size: 0.875rem;
	}

	.client-footer.follow-up {
		color: var(--color-amber-400);
	}
</style>
