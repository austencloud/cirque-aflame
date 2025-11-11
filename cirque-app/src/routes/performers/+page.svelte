<!-- src/routes/performers/+page.svelte -->
<script lang="ts">
	import { performers } from '$lib/state/performers.svelte';
	import type { Performer, PerformerSkillCategory } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import AddPerformerModal from '$lib/components/performers/AddPerformerModal.svelte';

	// State
	let loading = $state(true);
	let searchQuery = $state('');
	let skillFilter = $state<PerformerSkillCategory | 'all'>('all');
	let sortBy = $state<'name' | 'recent'>('name');
	let showAddModal = $state(false);

	// All functionality is now accessible without authentication
	const canEdit = true;

	// Load performers
	$effect(() => {
		async function loadData() {
			try {
				await performers.loadPerformers();
			} catch (error) {
				console.error('Error loading performers:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Handle performer added event
	function handlePerformerAdded(performer: Performer) {
		// The store already updated, so we just need to close the modal
		showAddModal = false;
		// Optionally, add some visual feedback or scroll to the new performer
		// You could add a highlight class to the performer element or scroll to it
	}

	// Filtered and sorted performers
	const filteredPerformers = $derived(
		performers.performers
			.filter((performer) => {
				const matchesQuery =
					searchQuery === '' ||
					performer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					performer.email?.toLowerCase().includes(searchQuery.toLowerCase());

				const matchesSkill =
					skillFilter === 'all' ||
					performer.skills.some((skill) => skill.category === skillFilter);

				return matchesQuery && matchesSkill;
			})
			.sort((a, b) => {
				if (sortBy === 'name') {
					return a.name.localeCompare(b.name);
				} else {
					// For 'recent', we would ideally have a lastUpdated field
					// For now, fallback to name
					return a.name.localeCompare(b.name);
				}
			})
	);

	// Skill mapping
	const skillCategoryNames: Record<PerformerSkillCategory, string> = {
		fire: 'Fire Performance',
		balloon: 'Balloon Art',
		stilt: 'Stilt Walking',
		juggle: 'Juggling',
		aerial: 'Aerial Arts',
		magic: 'Magic',
		other: 'Other Skills'
	};

	// UI helpers
	function getSkillBadgeClass(category: PerformerSkillCategory): string {
		const classes = {
			fire: 'skill-badge-fire',
			balloon: 'skill-badge-balloon',
			stilt: 'skill-badge-stilt',
			juggle: 'skill-badge-juggle',
			aerial: 'skill-badge-aerial',
			magic: 'skill-badge-magic',
			other: 'skill-badge-other'
		};
		return classes[category] || classes.other;
	}
</script>

<svelte:head>
	<title>Performers | Ringmaster</title>
</svelte:head>

<div class="page-container" data-page="performers-list">
	<div class="page-header">
		<h1 class="page-title">Performers</h1>
		{#if canEdit}
			<Button onclick={() => (showAddModal = true)} color="blue">
				{#snippet children()}
					<Icon name="plus" size={16} extraClass="mr-2" />
					Add Performer
				{/snippet}
			</Button>
		{/if}
	</div>

	{#if loading}
		<div class="loading-container">
			<LoadingSpinner size="lg" />
		</div>
	{:else}
		<!-- Search and filter bar -->
		<div class="filters-panel glass">
			<div class="filters-grid">
				<!-- Search -->
				<div class="search-wrapper">
					<div class="search-icon">
						<Icon name="search" size={16} extraClass="text-gray-400" />
					</div>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search performers..."
						class="search-input"
					/>
				</div>

				<!-- Skill Filter -->
				<div>
					<select bind:value={skillFilter} class="filter-select">
						<option value="all">All Skills</option>
						{#each Object.entries(skillCategoryNames) as [value, label]}
							<option {value}>{label}</option>
						{/each}
					</select>
				</div>

				<!-- Sort -->
				<div>
					<select bind:value={sortBy} class="filter-select">
						<option value="name">Sort by Name</option>
						<option value="recent">Sort by Recent</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Performers Grid -->
		{#if filteredPerformers.length > 0}
			<div class="performers-grid">
				{#each filteredPerformers as performer}
					<div class="performer-card card-base card-hover">
						<!-- Performer Card Header -->
						<div class="card-header">
							<div class="avatar-wrapper">
								{#if performer.profilePhoto}
									<img
										src={performer.profilePhoto}
										alt={performer.name}
										class="avatar-image"
									/>
								{:else}
									<div class="avatar-placeholder">
										<Icon name="user" size={24} />
									</div>
								{/if}
							</div>
							<div class="card-header-info">
								<h3 class="performer-name">{performer.name}</h3>
								{#if performer.email}
									<p class="performer-email">{performer.email}</p>
								{/if}
							</div>
							<a
								href={`/performers/${performer.id}`}
								class="view-link"
								aria-label="View details"
							>
								<Icon name="chevron-right" size={20} />
							</a>
						</div>

						<!-- Skills -->
						<div class="card-section">
							<h4 class="section-title">Skills</h4>
							<div class="skill-badges">
								{#each performer.skills as skill}
									<span class="skill-badge {getSkillBadgeClass(skill.category)}">
										{skill.category}
									</span>
								{/each}
							</div>
						</div>

						<!-- Contact Info -->
						<div class="card-section">
							<h4 class="section-title">Contact</h4>
							<div class="contact-info">
								{#if performer.phone}
									<div class="contact-item">
										<Icon name="phone" size={14} extraClass="mr-2" />
										{performer.phone}
									</div>
								{/if}
							</div>
						</div>

						<!-- Pay Rates Preview -->
						<div class="card-section">
							<h4 class="section-title">Pay Rates</h4>
							{#if performer.payRate && performer.payRate.length > 0}
								<div class="pay-rate-info">
									<span class="pay-rate-amount"
										>${Math.min(...performer.payRate.map((p) => p.rate))} - ${Math.max(
											...performer.payRate.map((p) => p.rate)
										)}</span
									>
									<span class="pay-rate-count">
										({performer.payRate.length}
										{performer.payRate.length === 1 ? 'rate' : 'rates'})
									</span>
								</div>
							{:else}
								<p class="no-data">No pay rates defined</p>
							{/if}
						</div>

						<!-- Card Footer -->
						<div class="card-footer">
							<span class="skill-count">
								{performer.skills.length}
								{performer.skills.length === 1 ? 'skill' : 'skills'}
							</span>
							{#if canEdit}
								<a href={`/performers/${performer.id}`} class="edit-link"> View Profile </a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="empty-state glass">
				<div class="empty-icon">
					<Icon name="search" size={48} extraClass="text-gray-300" />
				</div>
				<h3 class="empty-title">No performers found</h3>
				<p class="empty-message">Try changing your search or filters</p>
			</div>
		{/if}
	{/if}

	<!-- Add Performer Modal -->
	<AddPerformerModal
		isOpen={showAddModal}
		onclose={() => (showAddModal = false)}
		onadded={handlePerformerAdded}
	/>
</div>

<style>
	/* Page Container */
	.page-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	/* Page Header - Clean and simple */
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

	/* Loading */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 20rem;
	}

	/* Filters Panel - Match dashboard style */
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

	.search-input:focus {
		outline: none;
		border-color: var(--color-royal-500);
		box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
	}

	.search-input::placeholder {
		color: var(--color-gray-500);
	}

	/* Filter Select */
	.filter-select {
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-gray-700);
		border-radius: var(--radius-lg);
		background: var(--color-gray-800);
		color: var(--color-gray-100);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--color-royal-500);
		box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
	}

	/* Performers Grid */
	.performers-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	/* Performer Card - Clean design matching dashboard */
	.performer-card {
		border-radius: var(--radius-2xl);
		overflow: hidden;
	}

	/* Card Header */
	.card-header {
		display: flex;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	/* Avatar */
	.avatar-wrapper {
		flex-shrink: 0;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--color-gray-700);
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-royal-600), var(--color-flame-600));
		color: white;
	}

	/* Card Info */
	.card-header-info {
		flex: 1;
		margin-left: 1rem;
		min-width: 0;
	}

	.performer-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0;
	}

	.performer-email {
		font-size: 0.875rem;
		color: var(--color-gray-400);
		margin: 0.25rem 0 0 0;
	}

	/* View Link */
	.view-link {
		color: var(--color-gray-400);
		text-decoration: none;
		transition: all var(--transition-fast);
		padding: 0.25rem;
		border-radius: var(--radius-md);
	}

	.view-link:hover {
		color: var(--color-gray-100);
	}

	/* Card Sections */
	.card-section {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	.section-title {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-gray-400);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.75rem 0;
	}

	/* Skill Badges - Vibrant but not overwhelming */
	.skill-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: capitalize;
		transition: all var(--transition-fast);
	}

	.skill-badge:hover {
		transform: translateY(-1px);
	}

	.skill-badge-fire {
		background: rgba(249, 115, 22, 0.15);
		color: #fb923c;
		border: 1px solid rgba(249, 115, 22, 0.3);
	}

	.skill-badge-balloon {
		background: rgba(168, 85, 247, 0.15);
		color: #c084fc;
		border: 1px solid rgba(168, 85, 247, 0.3);
	}

	.skill-badge-stilt {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.skill-badge-juggle {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	.skill-badge-aerial {
		background: rgba(236, 72, 153, 0.15);
		color: #f472b6;
		border: 1px solid rgba(236, 72, 153, 0.3);
	}

	.skill-badge-magic {
		background: rgba(234, 179, 8, 0.15);
		color: #fbbf24;
		border: 1px solid rgba(234, 179, 8, 0.3);
	}

	.skill-badge-other {
		background: rgba(156, 163, 175, 0.15);
		color: #9ca3af;
		border: 1px solid rgba(156, 163, 175, 0.3);
	}

	/* Contact Info */
	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.contact-item {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		color: var(--color-gray-300);
	}

	/* Pay Rate Info */
	.pay-rate-info {
		font-size: 0.875rem;
		color: var(--color-gray-300);
	}

	.pay-rate-amount {
		font-weight: 600;
		color: var(--color-green-400);
	}

	.pay-rate-count {
		font-size: 0.75rem;
		color: var(--color-gray-500);
		margin-left: 0.375rem;
	}

	.no-data {
		font-size: 0.875rem;
		color: var(--color-gray-500);
		font-style: italic;
		margin: 0;
	}

	/* Card Footer */
	.card-footer {
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(17, 24, 39, 0.5);
	}

	.skill-count {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.edit-link {
		color: var(--color-royal-400);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		transition: all var(--transition-fast);
	}

	.edit-link:hover {
		color: var(--color-royal-300);
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
		margin: 0;
	}

	/* Responsive */
	@media (min-width: 640px) {
		.page-container {
			padding: 2rem 1.5rem;
		}

		.filters-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 768px) {
		.page-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.page-title {
			margin: 0;
		}

		.performers-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.page-container {
			padding: 2rem;
		}

		.performers-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
