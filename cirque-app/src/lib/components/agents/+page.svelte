<!-- src/routes/agents/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { agents } from '$lib/state/agents.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import type { Agent } from '$lib/types';

	const { page } = $props<{ page: any }>();

	// State
	let loading = $state(true);
	let searchQuery = $state('');

	// All functionality is now accessible without authentication
	const canEdit = true;

	// Load agents
	$effect(() => {
		async function loadData() {
			try {
				await agents.loadAgents();
			} catch (error) {
				console.error('Error loading agents:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Filtered agents
	const filteredAgents = $derived(
		agents.agents.filter((agent) => {
			if (!searchQuery) {
				return true;
			}
			const search = searchQuery.toLowerCase();
			return (
				agent.name.toLowerCase().includes(search) ||
				agent.agency.toLowerCase().includes(search) ||
				agent.email.toLowerCase().includes(search)
			);
		})
	);

	// Sort agents alphabetically
	const sortedAgents = $derived(
		[...filteredAgents].sort((a, b) => a.name.localeCompare(b.name))
	);
</script>

<svelte:head>
	<title>Agents | Ringmaster</title>
</svelte:head>

<div class="page-container" data-page="agents-list">
	<div class="page-header">
		<h1 class="page-title">Agents</h1>
		{#if canEdit}
			<Button onclick={() => goto('/agents/new')}>
				{#snippet children()}
					<Icon name="plus" size={18} extraClass="mr-1" />
					Add Agent
				{/snippet}
			</Button>
		{/if}
	</div>

	<!-- Search Bar -->
	<div class="filters-panel glass">
		<div class="search-wrapper">
			<div class="search-icon">
				<Icon name="search" size={20} extraClass="text-gray-400" />
			</div>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search agents by name, agency, or email..."
				class="search-input"
			/>
		</div>
	</div>

	{#if loading}
		<div class="loading-container">
			<LoadingSpinner size="lg" />
		</div>
	{:else if sortedAgents.length === 0}
		<div class="empty-state glass">
			<div class="empty-icon">
				<Icon name="briefcase" size={48} extraClass="text-gray-300" />
			</div>
			<h3 class="empty-title">No agents found</h3>
			<p class="empty-message">
				{searchQuery
					? 'Try adjusting your search criteria.'
					: 'Get started by adding your first agent.'}
			</p>
			{#if canEdit && !searchQuery}
				<Button onclick={() => goto('/agents/new')}>
					{#snippet children()}
						<Icon name="plus" size={18} extraClass="mr-1" />
						Add Your First Agent
					{/snippet}
				</Button>
			{/if}
		</div>
	{:else}
		<div class="agents-list">
			{#each sortedAgents as agent (agent.id)}
				<a href="/agents/{agent.id}" class="agent-card card-base card-hover">
					<div class="agent-header">
						<div class="agent-info">
							<h3 class="agent-name">{agent.name}</h3>
							<p class="agent-agency">{agent.agency}</p>
						</div>
						<div class="chevron-icon">
							<Icon name="chevron-right" size={20} extraClass="text-gray-400" />
						</div>
					</div>
					<div class="agent-details">
						<div class="detail-item">
							<Icon name="mail" size={16} extraClass="detail-icon" />
							<span>{agent.email}</span>
						</div>
						{#if agent.phone}
							<div class="detail-item">
								<Icon name="phone" size={16} extraClass="detail-icon" />
								<span>{agent.phone}</span>
							</div>
						{/if}
					</div>
					{#if agent.notes}
						<div class="agent-notes">
							<p>{agent.notes}</p>
						</div>
					{/if}
				</a>
			{/each}
		</div>

		<!-- Results count -->
		<div class="results-count">
			Showing {sortedAgents.length}
			{sortedAgents.length === 1 ? 'agent' : 'agents'}
			{#if searchQuery}
				matching "{searchQuery}"
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Page Container */
	.page-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	/* Page Header */
	.page-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
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
		padding: 0.625rem 0.75rem 0.625rem 2.75rem;
		border: 1px solid var(--color-gray-700);
		border-radius: var(--radius-lg);
		background: var(--color-gray-800);
		color: var(--color-gray-100);
		font-size: 0.875rem;
		transition: all var(--transition-fast);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-royal-500);
		box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
	}

	.search-input::placeholder {
		color: var(--color-gray-500);
	}

	/* Loading */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 20rem;
	}

	/* Empty State */
	.empty-state {
		border-radius: var(--radius-2xl);
		padding: 3rem 2rem;
		text-align: center;
	}

	.empty-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.empty-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0 0 0.5rem 0;
	}

	.empty-message {
		color: var(--color-gray-400);
		margin: 0 0 1rem 0;
	}

	/* Agents List */
	.agents-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Agent Card */
	.agent-card {
		border-radius: var(--radius-2xl);
		overflow: hidden;
		text-decoration: none;
		display: block;
		transition: all var(--transition-base);
	}

	.agent-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	.agent-info {
		flex: 1;
		min-width: 0;
	}

	.agent-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-royal-400);
		margin: 0 0 0.25rem 0;
	}

	.agent-agency {
		font-size: 0.875rem;
		color: var(--color-gray-400);
		margin: 0;
	}

	.chevron-icon {
		flex-shrink: 0;
		margin-left: 1rem;
	}

	.agent-details {
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	.detail-item {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		color: var(--color-gray-300);
	}

	:global(.detail-icon) {
		margin-right: 0.5rem;
		color: var(--color-gray-500);
	}

	.agent-notes {
		padding: 1rem 1.5rem;
		background: rgba(17, 24, 39, 0.5);
	}

	.agent-notes p {
		font-size: 0.875rem;
		color: var(--color-gray-400);
		margin: 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Results Count */
	.results-count {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-gray-500);
	}

	/* Responsive */
	@media (min-width: 768px) {
		.page-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.page-title {
			margin: 0;
		}

		.agent-details {
			flex-direction: row;
			gap: 2rem;
		}
	}

	@media (min-width: 1024px) {
		.page-container {
			padding: 2rem;
		}
	}
</style>
