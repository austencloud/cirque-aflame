<!-- src/routes/performers/[id]/+page.svelte -->
<script lang="ts">
	import { format } from 'date-fns';
	import { performers } from '$lib/state/performers.svelte';
	import { events } from '$lib/state/events.svelte';
	import { checkUserRole } from '$lib/services/auth.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tab from '$lib/components/ui/Tab.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import PerformerForm from '$lib/components/performers/PerformerForm.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	// State variables
	let loading = $state(true);
	let activeTab = $state('details');
	let showEditModal = $state(false);
	let showDeleteConfirm = $state(false);
	let isDeleting = $state(false);
	let performerEvents = $state([]);

	// User permissions
	const canEditPerformer = checkUserRole('admin');
	const performerId = data.performerId;

	$effect(() => {
		async function loadData() {
			try {
				// Load performer data
				await performers.loadPerformer(performerId);
				// Load performer's events
				await events.loadPerformerEvents(performerId);
				performerEvents = events.events;
			} catch (error) {
				console.error('Error loading performer data:', error);
			} finally {
				loading = false;
			}
		}
		loadData();
	});

	// Reactive variable based on store data
	const performer = $derived(performers.selectedPerformer);

	// Calculate performer metrics
	const upcomingEvents = $derived(
		performerEvents.filter(
			(e) => new Date(e.date) >= new Date() && e.status !== 'cancelled'
		).length
	);

	const pastEvents = $derived(
		performerEvents.filter(
			(e) => new Date(e.date) < new Date() || e.status === 'completed'
		).length
	);

	const totalEarnings = $derived(
		performerEvents
			.filter((e) => e.status !== 'cancelled')
			.reduce((sum, e) => {
				const performerAssignment = e.performers.find((p) => p.performer === performerId);
				return sum + (performerAssignment ? performerAssignment.pay : 0);
			}, 0)
	);

	// Get color for skill category badge
	function getColorForSkill(
		category: string
	): 'red' | 'purple' | 'green' | 'blue' | 'amber' | 'gray' {
		switch (category) {
			case 'fire':
				return 'red';
			case 'balloon':
				return 'purple';
			case 'stilt':
				return 'green';
			case 'juggle':
				return 'blue';
			case 'aerial':
				return 'amber';
			case 'magic':
				return 'blue';
			default:
				return 'gray';
		}
	}

	// Get color for skill level badge
	function getColorForLevel(level: string): 'blue' | 'amber' | 'green' | 'gray' {
		switch (level) {
			case 'beginner':
				return 'blue';
			case 'intermediate':
				return 'amber';
			case 'expert':
				return 'green';
			default:
				return 'gray';
		}
	}

	// Format skill category for display
	function formatSkillCategory(category: string): string {
		switch (category) {
			case 'fire':
				return 'Fire Performance';
			case 'balloon':
				return 'Balloon Art';
			case 'stilt':
				return 'Stilt Walking';
			case 'juggle':
				return 'Juggling';
			case 'aerial':
				return 'Aerial Arts';
			case 'magic':
				return 'Magic';
			default:
				return 'Other';
		}
	}

	// Format pay rate unit for display
	function formatPayRateUnit(unit: string): string {
		switch (unit) {
			case 'hourly':
				return 'Per Hour';
			case 'per-event':
				return 'Per Event';
			case 'per-day':
				return 'Per Day';
			default:
				return unit;
		}
	}

	// Handle performer update
	async function handleUpdatePerformer(performerData) {
		try {
			await performers.updatePerformer(performerId, performerData);
			showEditModal = false;
		} catch (error) {
			console.error('Error updating performer:', error);
		}
	}

	// Handle performer delete
	async function handleDeletePerformer() {
		isDeleting = true;
		try {
			await performers.deletePerformer(performerId);
			// Navigate to performers page
			window.location.href = '/performers';
		} catch (error) {
			console.error('Error deleting performer:', error);
			isDeleting = false;
			showDeleteConfirm = false;
		}
	}

	// Get event status badge color
	function getEventStatusColor(
		status: string
	): 'green' | 'blue' | 'gray' | 'purple' | 'red' | 'amber' {
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

	// Format event status for display
	function formatEventStatus(status: string): string {
		switch (status) {
			case 'deposit-received':
				return 'Deposit Received';
			default:
				return status.charAt(0).toUpperCase() + status.slice(1);
		}
	}

	// Update availability
	async function updateAvailability(
		date: Date,
		status: 'available' | 'unavailable' | 'tentative',
		notes?: string
	) {
		try {
			await performers.updateAvailability(performerId, date, status, notes);
		} catch (error) {
			console.error('Error updating availability:', error);
		}
	}
</script>

<svelte:head>
	<title>{performer?.name || 'Performer Details'} | CircusSync</title>
</svelte:head>

{#if loading}
	<div class="loading-container">
		<LoadingSpinner size="lg" />
	</div>
{:else if !performer}
	<div class="empty-state glass">
		<h1 class="empty-title" style="color: var(--color-red-400);">Performer Not Found</h1>
		<p class="empty-description">
			The performer you're looking for doesn't exist or you don't have permission to view it.
		</p>
		<Button href="/performers">
			{#snippet children()}Back to Performers{/snippet}
		</Button>
	</div>
{:else}
	<!-- Performer Header -->
	<div class="performer-header glass">
		<div class="page-container">
			<div class="header-content">
				<!-- Performer Name and Primary Skill -->
				<div class="performer-info">
					{#if performer.profilePhoto}
						<img
							src={performer.profilePhoto}
							alt={performer.name}
							class="performer-avatar"
						/>
					{:else}
						<div class="performer-avatar-placeholder">
							<span class="avatar-initials">
								{performer.name
									.split(' ')
									.map((n) => n[0])
									.join('')
									.toUpperCase()}
							</span>
						</div>
					{/if}
					<div class="performer-details">
						<h1 class="performer-name">{performer.name}</h1>
						{#if performer.skills && performer.skills.length > 0}
							<div class="skills-preview">
								{#each performer.skills.slice(0, 2) as skill}
									<Badge color={getColorForSkill(skill.category)}>
										{#snippet children()}{formatSkillCategory(skill.category)}{/snippet}
									</Badge>
								{/each}
								{#if performer.skills.length > 2}
									<span class="more-skills">+{performer.skills.length - 2} more</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<!-- Action Buttons -->
				{#if canEditPerformer}
					<div class="action-buttons">
						<Button variant="outline" onclick={() => (showEditModal = true)}>
							{#snippet children()}
								<Icon name="edit" size={16} extraClass="mr-1" />
								Edit Profile
							{/snippet}
						</Button>
						<Button variant="outline" color="red" onclick={() => (showDeleteConfirm = true)}>
							{#snippet children()}
								<Icon name="trash-2" size={16} extraClass="mr-1" />
								Delete
							{/snippet}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Tabs Navigation -->
	<div class="tabs-container glass">
		<div class="page-container">
			<div class="tabs-wrapper">
				<Tab
					label="Details"
					active={activeTab === 'details'}
					onclick={() => (activeTab = 'details')}
				/>
				<Tab
					label="Skills"
					active={activeTab === 'skills'}
					onclick={() => (activeTab = 'skills')}
					badge={performer.skills ? performer.skills.length.toString() : '0'}
				/>
				<Tab
					label="Events"
					active={activeTab === 'events'}
					onclick={() => (activeTab = 'events')}
					badge={performerEvents.length.toString()}
				/>
				<Tab
					label="Availability"
					active={activeTab === 'availability'}
					onclick={() => (activeTab = 'availability')}
				/>
				<Tab
					label="Notes"
					active={activeTab === 'notes'}
					onclick={() => (activeTab = 'notes')}
				/>
			</div>
		</div>
	</div>

	<!-- Tab Content -->
	<div class="content-container">
		<!-- Details Tab -->
		{#if activeTab === 'details'}
			<div class="details-grid">
				<!-- Performer Details -->
				<div class="info-card card-base">
					<h2 class="section-title">Contact Information</h2>
					<div class="contact-info">
						{#if performer.email}
							<div class="contact-item">
								<Icon name="mail" size={16} extraClass="contact-icon" />
								<a href="mailto:{performer.email}" class="contact-link">
									{performer.email}
								</a>
							</div>
						{/if}
						{#if performer.phone}
							<div class="contact-item">
								<Icon name="phone" size={16} extraClass="contact-icon" />
								<a href="tel:{performer.phone}" class="contact-link">
									{performer.phone}
								</a>
							</div>
						{/if}
						{#if performer.address}
							<div class="contact-item">
								<Icon name="map-pin" size={16} extraClass="contact-icon" />
								<p class="contact-text">{performer.address}</p>
							</div>
						{/if}
					</div>

					{#if performer.payRate && performer.payRate.length > 0}
						<div class="pay-rates-section">
							<h2 class="section-title">Pay Rates</h2>
							<div class="table-wrapper">
								<table class="data-table">
									<thead>
										<tr>
											<th>Category</th>
											<th>Rate</th>
											<th>Unit</th>
										</tr>
									</thead>
									<tbody>
										{#each performer.payRate as rate}
											<tr>
												<td class="table-cell-primary">{rate.category}</td>
												<td class="table-cell">${rate.rate.toFixed(2)}</td>
												<td class="table-cell">{formatPayRateUnit(rate.unit)}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/if}
				</div>

				<!-- Performance Metrics -->
				<div class="metrics-sidebar">
					<div class="metrics-card card-base">
						<h2 class="section-title">Performance Summary</h2>
						<div class="metrics-grid">
							<div class="metric-box metric-blue">
								<p class="metric-label">Upcoming Events</p>
								<p class="metric-value">{upcomingEvents}</p>
							</div>
							<div class="metric-box metric-purple">
								<p class="metric-label">Past Events</p>
								<p class="metric-value">{pastEvents}</p>
							</div>
							<div class="metric-box metric-green metric-full">
								<p class="metric-label">Total Earnings</p>
								<p class="metric-value">${totalEarnings.toFixed(2)}</p>
							</div>
						</div>
					</div>

					<div class="actions-card card-base">
						<h2 class="section-title">Quick Actions</h2>
						<div class="actions-list">
							<Button href="/events/new?performer={performer.id}" fullWidth={true}>
								{#snippet children()}
									<Icon name="calendar" size={16} extraClass="mr-1" />
									Add to New Event
								{/snippet}
							</Button>
							<Button variant="outline" fullWidth={true} href={`mailto:${performer.email}`}>
								{#snippet children()}
									<Icon name="mail" size={16} extraClass="mr-1" />
									Send Email
								{/snippet}
							</Button>
							<Button
								variant="outline"
								color="blue"
								fullWidth={true}
								href="/performers/{performer.id}/schedule"
							>
								{#snippet children()}
									<Icon name="calendar" size={16} extraClass="mr-1" />
									Manage Schedule
								{/snippet}
							</Button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Skills Tab -->
		{#if activeTab === 'skills'}
			<div class="tab-content">
				<div class="tab-header">
					<h2 class="tab-title">Skills & Specialties</h2>
					{#if canEditPerformer}
						<Button variant="outline" onclick={() => (showEditModal = true)}>
							{#snippet children()}
								<Icon name="plus" size={16} extraClass="mr-1" />
								Add Skill
							{/snippet}
						</Button>
					{/if}
				</div>

				{#if !performer.skills || performer.skills.length === 0}
					<div class="empty-state glass">
						<p class="empty-description">No skills have been added yet.</p>
						{#if canEditPerformer}
							<Button onclick={() => (showEditModal = true)}>
								{#snippet children()}Add First Skill{/snippet}
							</Button>
						{/if}
					</div>
				{:else}
					<div class="skills-grid">
						{#each performer.skills as skill}
							<div class="skill-card card-base">
								<div class="skill-content">
									<div class="skill-header">
										<h3 class="skill-name">
											{formatSkillCategory(skill.category)}
										</h3>
										<Badge color={getColorForLevel(skill.level)}>
											{#snippet children()}{skill.level.charAt(0).toUpperCase() +
												skill.level.slice(1)}{/snippet}
										</Badge>
									</div>

									{#if skill.props && skill.props.length > 0}
										<div class="skill-section">
											<h4 class="skill-section-title">Props</h4>
											<div class="skill-tags">
												{#each skill.props as prop}
													<span class="skill-tag">
														{prop}
													</span>
												{/each}
											</div>
										</div>
									{/if}

									{#if skill.acts && skill.acts.length > 0}
										<div class="skill-section">
											<h4 class="skill-section-title">Signature Acts</h4>
											<div class="skill-tags">
												{#each skill.acts as act}
													<span class="skill-tag skill-tag-blue">
														{act}
													</span>
												{/each}
											</div>
										</div>
									{/if}
								</div>

								{#if canEditPerformer}
									<div class="skill-footer">
										<button
											class="skill-edit-button"
											onclick={() => {
												/* Open edit skill modal */
											}}
										>
											Edit
										</button>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Events Tab -->
		{#if activeTab === 'events'}
			<div class="tab-content">
				<div class="tab-header">
					<h2 class="tab-title">Events ({performerEvents.length})</h2>
					{#if canEditPerformer}
						<Button href="/events/new?performer={performer.id}">
							{#snippet children()}
								<Icon name="plus" size={16} extraClass="mr-1" />
								Add to Event
							{/snippet}
						</Button>
					{/if}
				</div>

				{#if performerEvents.length === 0}
					<div class="empty-state glass">
						<p class="empty-description">No events found for this performer.</p>
						{#if canEditPerformer}
							<Button href="/events/new?performer={performer.id}">
								{#snippet children()}Add to Event{/snippet}
							</Button>
						{/if}
					</div>
				{:else}
					<div class="events-list">
						{#each performerEvents as event (event.id)}
							<a href="/events/{event.id}" class="event-item card-base card-hover">
								<div class="event-header">
									<div class="event-info">
										<p class="event-name">{event.name}</p>
										<p class="event-date">
											{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
										</p>
									</div>
									<div class="event-badge">
										<Badge
											color={getEventStatusColor(event.status) as
												| 'red'
												| 'purple'
												| 'green'
												| 'blue'
												| 'amber'
												| 'gray'}
										>
											{#snippet children()}{formatEventStatus(event.status)}{/snippet}
										</Badge>
									</div>
								</div>

								<div class="event-details">
									<div class="event-meta">
										<div class="event-meta-item">
											<Icon name="clock" size={16} extraClass="meta-icon" />
											{event.performanceTime.start} - {event.performanceTime.end}
										</div>
										<div class="event-meta-item">
											<Icon name="map-pin" size={16} extraClass="meta-icon" />
											{event.location.address.split(',')[0]}
										</div>
									</div>

									{#if event.performers.find((p) => p.performer === performerId)}
										{@const performerAssignment = event.performers.find(
											(p) => p.performer === performerId
										)}
										<div class="event-pay">
											<Icon name="dollar-sign" size={16} extraClass="pay-icon" />
											${performerAssignment.pay.toFixed(2)}
										</div>
									{/if}
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Availability Tab -->
		{#if activeTab === 'availability'}
			<div class="availability-card card-base">
				<div class="tab-header">
					<h2 class="tab-title">Availability Calendar</h2>
					{#if canEditPerformer}
						<Button
							variant="outline"
							onclick={() => {
								/* Open add availability modal */
							}}
						>
							{#snippet children()}
								<Icon name="plus" size={16} extraClass="mr-1" />
								Set Availability
							{/snippet}
						</Button>
					{/if}
				</div>

				<!-- Placeholder for availability calendar -->
				<div class="placeholder-message">
					<p>Availability calendar will be implemented here.</p>
					<p class="placeholder-subtitle">Coming soon!</p>
				</div>

				{#if performer.availability && performer.availability.length > 0}
					<div class="availability-records">
						<h3 class="section-title">Availability Records</h3>
						<div class="table-wrapper">
							<table class="data-table">
								<thead>
									<tr>
										<th>Date</th>
										<th>Status</th>
										<th>Notes</th>
										{#if canEditPerformer}
											<th class="table-actions-header">Actions</th>
										{/if}
									</tr>
								</thead>
								<tbody>
									{#each performer.availability as avail}
										<tr>
											<td class="table-cell-primary">
												{format(new Date(avail.date), 'MMMM d, yyyy')}
											</td>
											<td>
												{#if avail.status === 'available'}
													<span class="availability-badge availability-available">
														Available
													</span>
												{:else if avail.status === 'unavailable'}
													<span class="availability-badge availability-unavailable">
														Unavailable
													</span>
												{:else}
													<span class="availability-badge availability-tentative">
														Tentative
													</span>
												{/if}
											</td>
											<td class="table-cell">
												{avail.notes || '-'}
											</td>
											{#if canEditPerformer}
												<td class="table-actions">
													<button type="button" class="table-action-button">Edit</button>
													<button type="button" class="table-action-button table-action-danger">
														Remove
													</button>
												</td>
											{/if}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Notes Tab -->
		{#if activeTab === 'notes'}
			<div class="notes-card card-base">
				<div class="tab-header">
					<h2 class="tab-title">Performer Notes</h2>
					{#if canEditPerformer}
						<Button
							variant="outline"
							onclick={() => {
								/* Open edit notes modal */
							}}
						>
							{#snippet children()}
								<Icon name="edit" size={16} extraClass="mr-1" />
								Edit Notes
							{/snippet}
						</Button>
					{/if}
				</div>

				{#if performer.notes}
					<div class="notes-content">
						{performer.notes}
					</div>
				{:else}
					<div class="notes-empty">
						<p>No notes have been added for this performer.</p>
						{#if canEditPerformer}
							<Button
								onclick={() => {
									/* Open edit notes modal */
								}}
							>
								{#snippet children()}Add Notes{/snippet}
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Modals -->
	{#if showEditModal}
		<Modal title="Edit Performer" size="lg" onclose={() => (showEditModal = false)}>
			<PerformerForm
				{performer}
				submitLabel="Update Performer"
				onsubmit={handleUpdatePerformer}
				oncancel={() => (showEditModal = false)}
			/>
		</Modal>
	{/if}

	{#if showDeleteConfirm}
		<ConfirmDialog
			title="Delete Performer"
			message="Are you sure you want to delete this performer? This action cannot be undone and will remove all performer data."
			confirmText="Delete Performer"
			confirmColor="red"
			onconfirm={handleDeletePerformer}
			oncancel={() => (showDeleteConfirm = false)}
			isLoading={isDeleting}
		/>
	{/if}
{/if}

<style>
	/* Page Container */
	.page-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* Loading */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 20rem;
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
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-gray-100);
		margin: 0 0 0.5rem 0;
	}

	.empty-description {
		color: var(--color-gray-400);
		margin: 0 0 1.5rem 0;
	}

	/* Performer Header */
	.performer-header {
		margin-bottom: 1.5rem;
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-soft-lg);
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
	}

	.performer-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.performer-avatar {
		width: 4rem;
		height: 4rem;
		border-radius: var(--radius-full);
		object-fit: cover;
	}

	.performer-avatar-placeholder {
		width: 4rem;
		height: 4rem;
		border-radius: var(--radius-full);
		background: rgba(59, 130, 246, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar-initials {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-royal-400);
	}

	.performer-details {
		flex: 1;
		min-width: 0;
	}

	.performer-name {
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--color-gray-100);
		margin: 0 0 0.5rem 0;
	}

	.skills-preview {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.more-skills {
		font-size: 0.875rem;
		color: var(--color-gray-400);
	}

	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	/* Tabs Container */
	.tabs-container {
		margin-bottom: 1.5rem;
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-soft-lg);
	}

	.tabs-wrapper {
		display: flex;
		overflow-x: auto;
		padding: 0.5rem 1.5rem;
		gap: 0.5rem;
	}

	/* Content Container */
	.content-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem 2rem;
	}

	.tab-content {
		width: 100%;
	}

	.tab-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.tab-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0;
	}

	/* Details Grid */
	.details-grid {
		display: grid;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.details-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Info Card */
	.info-card {
		padding: 1.5rem;
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0 0 1rem 0;
	}

	/* Contact Info */
	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.contact-icon) {
		color: var(--color-gray-500);
		flex-shrink: 0;
	}

	.contact-link {
		color: var(--color-royal-400);
		text-decoration: none;
	}

	.contact-link:hover {
		text-decoration: underline;
	}

	.contact-text {
		flex: 1;
		color: var(--color-gray-300);
		margin: 0;
	}

	/* Pay Rates */
	.pay-rates-section {
		margin-top: 1.5rem;
	}

	/* Table Styles */
	.table-wrapper {
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--color-gray-800);
		border: 1px solid var(--color-gray-700);
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table thead {
		background: var(--color-gray-750);
	}

	.data-table th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-gray-400);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.data-table tbody tr {
		border-top: 1px solid var(--color-gray-700);
	}

	.data-table td {
		padding: 1rem;
	}

	.table-cell {
		font-size: 0.875rem;
		color: var(--color-gray-400);
	}

	.table-cell-primary {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-100);
	}

	.table-actions-header {
		text-align: right;
	}

	.table-actions {
		text-align: right;
		white-space: nowrap;
	}

	.table-action-button {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-royal-400);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		margin-left: 0.5rem;
	}

	.table-action-button:hover {
		color: var(--color-royal-300);
	}

	.table-action-danger {
		color: var(--color-red-400);
	}

	.table-action-danger:hover {
		color: var(--color-red-300);
	}

	/* Metrics */
	.metrics-sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.metrics-card,
	.actions-card {
		padding: 1.5rem;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.metric-box {
		padding: 1rem;
		border-radius: var(--radius-lg);
		border: 1px solid;
	}

	.metric-blue {
		background: rgba(59, 130, 246, 0.1);
		border-color: rgba(59, 130, 246, 0.3);
	}

	.metric-purple {
		background: rgba(168, 85, 247, 0.1);
		border-color: rgba(168, 85, 247, 0.3);
	}

	.metric-green {
		background: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.3);
	}

	.metric-full {
		grid-column: 1 / -1;
	}

	.metric-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-300);
		margin: 0 0 0.25rem 0;
	}

	.metric-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-gray-100);
		margin: 0;
	}

	.actions-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Skills */
	.skills-grid {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.skills-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.skills-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.skill-card {
		overflow: hidden;
	}

	.skill-content {
		padding: 1.5rem;
	}

	.skill-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.skill-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0;
	}

	.skill-section {
		margin-top: 1rem;
	}

	.skill-section-title {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.5rem 0;
	}

	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		border-radius: var(--radius-full);
		background: var(--color-gray-700);
		color: var(--color-gray-300);
	}

	.skill-tag-blue {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	.skill-footer {
		padding: 0.75rem 1.5rem;
		border-top: 1px solid var(--color-gray-700);
		background: rgba(17, 24, 39, 0.5);
		text-align: right;
	}

	.skill-edit-button {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-royal-400);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
	}

	.skill-edit-button:hover {
		color: var(--color-royal-300);
	}

	/* Events List */
	.events-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.event-item {
		display: block;
		text-decoration: none;
		padding: 1.5rem;
	}

	.event-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
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
		margin: 0 0 0.25rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.event-date {
		font-size: 0.875rem;
		color: var(--color-gray-400);
		margin: 0;
	}

	.event-badge {
		flex-shrink: 0;
	}

	.event-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.event-details {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.event-meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (min-width: 640px) {
		.event-meta {
			flex-direction: row;
			gap: 1.5rem;
		}
	}

	.event-meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-gray-400);
	}

	:global(.meta-icon) {
		color: var(--color-gray-500);
		flex-shrink: 0;
	}

	.event-pay {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-green-400);
	}

	:global(.pay-icon) {
		color: var(--color-green-500);
		flex-shrink: 0;
	}

	/* Availability */
	.availability-card,
	.notes-card {
		padding: 1.5rem;
	}

	.placeholder-message {
		padding: 3rem 2rem;
		text-align: center;
		color: var(--color-gray-400);
		border: 2px dashed var(--color-gray-700);
		border-radius: var(--radius-lg);
	}

	.placeholder-subtitle {
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}

	.availability-records {
		margin-top: 1.5rem;
	}

	.availability-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.availability-available {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.availability-unavailable {
		background: rgba(239, 68, 68, 0.15);
		color: #f87171;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	.availability-tentative {
		background: rgba(245, 158, 11, 0.15);
		color: #fbbf24;
		border: 1px solid rgba(245, 158, 11, 0.3);
	}

	/* Notes */
	.notes-content {
		white-space: pre-line;
		padding: 1.5rem;
		background: var(--color-gray-800);
		border-radius: var(--radius-lg);
		min-height: 12.5rem;
		color: var(--color-gray-300);
		line-height: 1.6;
	}

	.notes-empty {
		padding: 3rem 2rem;
		text-align: center;
		background: var(--color-gray-800);
		border-radius: var(--radius-lg);
		min-height: 12.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.notes-empty p {
		color: var(--color-gray-400);
		margin: 0;
	}

	/* Responsive */
	@media (min-width: 768px) {
		.header-content {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}
</style>
