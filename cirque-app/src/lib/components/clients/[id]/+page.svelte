<!-- src/lib/components/clients/[id]/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { clients } from '$lib/state/clients.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import ClientForm from '$lib/components/clients/ClientForm.svelte';
	import type { Client } from '$lib/types';

	interface Props {
		clientId: string;
	}

	const { clientId }: Props = $props();

	// State
	let isEditing = $state(false);
	let showDeleteConfirm = $state(false);

	// All functionality is now accessible without authentication
	const canEdit = true;

	// Load client data
	$effect(() => {
		if (clientId) {
			clients.loadClient(clientId);
		}
	});

	// Reactive client data
	const client = $derived(clients.selectedClient);
	const loading = $derived(clients.loading);
	const error = $derived(clients.error);

	// Handle edit mode
	function handleEdit() {
		isEditing = true;
	}

	function handleCancelEdit() {
		isEditing = false;
	}

	async function handleSaveEdit(data: Partial<Client>) {
		await clients.updateClient(clientId, data);
		isEditing = false;
	}

	// Handle delete
	function handleDeleteClick() {
		showDeleteConfirm = true;
	}

	function handleCancelDelete() {
		showDeleteConfirm = false;
	}

	async function handleConfirmDelete() {
		await clients.deleteClient(clientId);
		showDeleteConfirm = false;
		goto('/clients');
	}

	// Format date helper
	function formatDate(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Get status badge color
	function getStatusColor(status: string): string {
		switch (status) {
			case 'active':
				return 'green';
			case 'yearly':
				return 'gold';
			case 'lead':
				return 'blue';
			case 'inactive':
				return 'gray';
			default:
				return 'gray';
		}
	}
</script>

<svelte:head>
	<title>{client?.name || 'Client'} | CircusSync</title>
</svelte:head>

<div class="page-container" data-page="client-detail">
	<!-- Header with back button -->
	<div class="page-header">
		<div class="header-top">
			<Button variant="ghost" onclick={() => goto('/clients')}>
				{#snippet children()}
					<Icon name="arrow-left" size={18} extraClass="mr-1" />
					Back to Clients
				{/snippet}
			</Button>
		</div>

		{#if loading}
			<div class="loading-container">
				<LoadingSpinner size="lg" />
			</div>
		{:else if error}
			<div class="error-state glass">
				<div class="error-icon">
					<Icon name="alert-circle" size={48} extraClass="text-red-500" />
				</div>
				<h3 class="error-title">Error Loading Client</h3>
				<p class="error-message">{error}</p>
				<Button onclick={() => goto('/clients')}>
					{#snippet children()}Return to Clients{/snippet}
				</Button>
			</div>
		{:else if !client}
			<div class="error-state glass">
				<div class="error-icon">
					<Icon name="alert-circle" size={48} extraClass="text-gray-400" />
				</div>
				<h3 class="error-title">Client Not Found</h3>
				<p class="error-message">The client you're looking for doesn't exist.</p>
				<Button onclick={() => goto('/clients')}>
					{#snippet children()}Return to Clients{/snippet}
				</Button>
			</div>
		{:else if isEditing}
			<!-- Edit Mode -->
			<div class="edit-section glass">
				<h2 class="section-title">Edit Client</h2>
				<ClientForm
					client={client}
					submitLabel="Save Changes"
					onsubmit={handleSaveEdit}
					oncancel={handleCancelEdit}
				/>
			</div>
		{:else}
			<!-- View Mode -->
			<div class="client-header">
				<div class="header-info">
					<h1 class="client-name">{client.name}</h1>
					<div class="status-badge" data-status={client.status}>
						{client.status.charAt(0).toUpperCase() + client.status.slice(1)}
					</div>
				</div>
				{#if canEdit}
					<div class="header-actions">
						<Button variant="outline" onclick={handleEdit}>
							{#snippet children()}
								<Icon name="pencil" size={18} extraClass="mr-1" />
								Edit
							{/snippet}
						</Button>
						<Button variant="outline" color="red" onclick={handleDeleteClick}>
							{#snippet children()}
								<Icon name="trash-2" size={18} extraClass="mr-1" />
								Delete
							{/snippet}
						</Button>
					</div>
				{/if}
			</div>

			<!-- Contact Information -->
			<div class="info-section glass">
				<h3 class="section-title">Contact Information</h3>
				<div class="info-grid">
					<div class="info-item">
						<div class="info-label">
							<Icon name="user" size={16} extraClass="info-icon" />
							Contact Person
						</div>
						<div class="info-value">{client.contactPerson || 'N/A'}</div>
					</div>
					<div class="info-item">
						<div class="info-label">
							<Icon name="mail" size={16} extraClass="info-icon" />
							Email
						</div>
						<div class="info-value">
							{#if client.email}
								<a href="mailto:{client.email}" class="link">{client.email}</a>
							{:else}
								N/A
							{/if}
						</div>
					</div>
					<div class="info-item">
						<div class="info-label">
							<Icon name="phone" size={16} extraClass="info-icon" />
							Phone
						</div>
						<div class="info-value">
							{#if client.phone}
								<a href="tel:{client.phone}" class="link">{client.phone}</a>
							{:else}
								N/A
							{/if}
						</div>
					</div>
					<div class="info-item">
						<div class="info-label">
							<Icon name="map-pin" size={16} extraClass="info-icon" />
							Address
						</div>
						<div class="info-value">{client.address || 'N/A'}</div>
					</div>
				</div>
			</div>

			<!-- Event Types & Services -->
			<div class="details-grid">
				<div class="info-section glass">
					<h3 class="section-title">Event Types</h3>
					{#if client.eventTypes && client.eventTypes.length > 0}
						<div class="tag-list">
							{#each client.eventTypes as eventType}
								<div class="tag tag-event-type">{eventType}</div>
							{/each}
						</div>
					{:else}
						<p class="empty-text">No event types specified</p>
					{/if}
				</div>

				<div class="info-section glass">
					<h3 class="section-title">Services Used</h3>
					{#if client.servicesUsed && client.servicesUsed.length > 0}
						<div class="tag-list">
							{#each client.servicesUsed as service}
								<div class="tag tag-service">{service}</div>
							{/each}
						</div>
					{:else}
						<p class="empty-text">No services specified</p>
					{/if}
				</div>
			</div>

			<!-- Activity Timeline -->
			<div class="info-section glass">
				<h3 class="section-title">Activity Timeline</h3>
				<div class="timeline-grid">
					<div class="timeline-item">
						<div class="timeline-label">
							<Icon name="calendar-check" size={16} extraClass="timeline-icon" />
							Last Performed
						</div>
						<div class="timeline-value">{formatDate(client.lastPerformed)}</div>
					</div>
					<div class="timeline-item">
						<div class="timeline-label">
							<Icon name="message-circle" size={16} extraClass="timeline-icon" />
							Last Contacted
						</div>
						<div class="timeline-value">{formatDate(client.lastContacted)}</div>
					</div>
				</div>
			</div>

			<!-- Follow-Up -->
			{#if client.nextFollowUp && (client.nextFollowUp.date || client.nextFollowUp.task)}
				<div class="info-section glass follow-up-section">
					<h3 class="section-title">
						<Icon name="bell" size={18} extraClass="mr-2" />
						Next Follow-Up
					</h3>
					<div class="follow-up-content">
						{#if client.nextFollowUp.date}
							<div class="follow-up-date">
								<Icon name="calendar" size={16} extraClass="mr-1" />
								{formatDate(client.nextFollowUp.date)}
							</div>
						{/if}
						{#if client.nextFollowUp.task}
							<p class="follow-up-task">{client.nextFollowUp.task}</p>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Notes -->
			{#if client.notes}
				<div class="info-section glass">
					<h3 class="section-title">Notes</h3>
					<p class="notes-content">{client.notes}</p>
				</div>
			{/if}

			<!-- Events (placeholder for future implementation) -->
			{#if client.events && client.events.length > 0}
				<div class="info-section glass">
					<h3 class="section-title">Related Events</h3>
					<p class="empty-text">Event details coming soon</p>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="modal-overlay" onclick={handleCancelDelete}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<Icon name="alert-triangle" size={48} extraClass="text-red-500" />
				<h3 class="modal-title">Delete Client</h3>
			</div>
			<p class="modal-message">
				Are you sure you want to delete <strong>{client?.name}</strong>? This action cannot be
				undone.
			</p>
			<div class="modal-actions">
				<Button variant="outline" onclick={handleCancelDelete}>
					{#snippet children()}Cancel{/snippet}
				</Button>
				<Button color="red" onclick={handleConfirmDelete}>
					{#snippet children()}Delete Client{/snippet}
				</Button>
			</div>
		</div>
	</div>
{/if}

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
		gap: 1.5rem;
	}

	.header-top {
		display: flex;
		align-items: center;
	}

	.client-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.header-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.client-name {
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--color-gray-100);
		margin: 0;
	}

	.status-badge {
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: capitalize;
	}

	.status-badge[data-status='active'] {
		background: var(--color-green-100);
		color: var(--color-green-700);
	}

	.status-badge[data-status='yearly'] {
		background: var(--color-gold-100);
		color: var(--color-gold-700);
	}

	.status-badge[data-status='lead'] {
		background: var(--color-blue-100);
		color: var(--color-blue-700);
	}

	.status-badge[data-status='inactive'] {
		background: var(--color-gray-200);
		color: var(--color-gray-700);
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	/* Loading and Error States */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 20rem;
	}

	.error-state {
		border-radius: var(--radius-2xl);
		padding: 3rem 2rem;
		text-align: center;
	}

	.error-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.error-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0 0 0.5rem 0;
	}

	.error-message {
		color: var(--color-gray-400);
		margin: 0 0 1.5rem 0;
	}

	/* Info Sections */
	.info-section {
		border-radius: var(--radius-2xl);
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-soft-lg);
	}

	.edit-section {
		border-radius: var(--radius-2xl);
		padding: 2rem;
		box-shadow: var(--shadow-soft-lg);
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0 0 1rem 0;
		display: flex;
		align-items: center;
	}

	.info-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.info-label {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-400);
	}

	:global(.info-icon) {
		margin-right: 0.5rem;
		color: var(--color-gray-500);
	}

	.info-value {
		font-size: 1rem;
		color: var(--color-gray-100);
	}

	.link {
		color: var(--color-royal-400);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.link:hover {
		color: var(--color-royal-300);
		text-decoration: underline;
	}

	/* Details Grid */
	.details-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	/* Tags */
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.tag-event-type {
		background: var(--color-blue-100);
		color: var(--color-blue-700);
	}

	.tag-service {
		background: var(--color-green-100);
		color: var(--color-green-700);
	}

	.empty-text {
		color: var(--color-gray-500);
		font-style: italic;
		margin: 0;
	}

	/* Timeline */
	.timeline-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	.timeline-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.timeline-label {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-400);
	}

	:global(.timeline-icon) {
		margin-right: 0.5rem;
		color: var(--color-gray-500);
	}

	.timeline-value {
		font-size: 1rem;
		color: var(--color-gray-100);
	}

	/* Follow-Up Section */
	.follow-up-section {
		background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05));
		border: 1px solid rgba(168, 85, 247, 0.2);
	}

	.follow-up-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.follow-up-date {
		display: flex;
		align-items: center;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-royal-400);
	}

	.follow-up-task {
		font-size: 0.875rem;
		color: var(--color-gray-300);
		margin: 0;
	}

	/* Notes */
	.notes-content {
		color: var(--color-gray-300);
		line-height: 1.6;
		margin: 0;
		white-space: pre-wrap;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: var(--color-gray-800);
		border-radius: var(--radius-2xl);
		padding: 2rem;
		max-width: 28rem;
		width: 100%;
		box-shadow: var(--shadow-2xl);
	}

	.modal-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}

	.modal-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0.5rem 0 0 0;
	}

	.modal-message {
		color: var(--color-gray-300);
		margin: 0 0 1.5rem 0;
		text-align: center;
	}

	.modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}

	/* Responsive */
	@media (min-width: 640px) {
		.info-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.timeline-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.details-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 768px) {
		.client-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.header-actions {
			margin-left: auto;
		}
	}

	@media (min-width: 1024px) {
		.page-container {
			padding: 2rem;
		}
	}
</style>
