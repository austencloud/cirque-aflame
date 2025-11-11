<script lang="ts">
	import { format } from 'date-fns';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import DashboardCard from '$lib/components/dashboard/DashboardCard.svelte';
	import UpcomingEvents from '$lib/components/dashboard/UpcomingEvents.svelte';
	import FollowUpList from '$lib/components/dashboard/FollowUpList.svelte';
	import TaskList from '$lib/components/dashboard/TaskList.svelte';
	import RecentActivity from '$lib/components/dashboard/RecentActivity.svelte';
	import VoiceImport from '$lib/components/VoiceImport.svelte';
	import { events } from '$lib/state/events.svelte';
	import { clients } from '$lib/state/clients.svelte';
	import { performers } from '$lib/state/performers.svelte';
	import type { Task } from '$lib/types';

	// State
	let loading = $state(true);

	// Mock data for initial development - Explicitly typed as Task[]
	const mockTasks: Task[] = [
		{
			id: '1',
			title: 'Send contract to Pritzker Elementary',
			description: 'For the Back to School event',
			dueDate: new Date(2024, 6, 21),
			completed: false,
			priority: 'high',
			relatedTo: { type: 'client', id: 'client1' },
			createdAt: new Date(2024, 6, 1),
			updatedAt: new Date(2024, 6, 1)
		},
		{
			id: '2',
			title: 'Follow up with Agudath Jacob',
			description: 'Regarding Hannukah planning',
			dueDate: new Date(2024, 6, 14),
			completed: false,
			priority: 'high',
			relatedTo: { type: 'client', id: 'client2' },
			createdAt: new Date(2024, 6, 1),
			updatedAt: new Date(2024, 6, 1)
		},
		{
			id: '3',
			title: 'Confirm performers for Jefferson Park',
			description: 'Block party on August 15',
			dueDate: new Date(2024, 7, 1),
			completed: false,
			priority: 'medium',
			relatedTo: { type: 'event', id: 'event3' },
			createdAt: new Date(2024, 6, 2),
			updatedAt: new Date(2024, 6, 2)
		},
		{
			id: '4',
			title: 'Order new fire props',
			description: 'Replace worn-out equipment',
			dueDate: new Date(2024, 6, 30),
			completed: true,
			priority: 'low',
			createdAt: new Date(2024, 5, 15),
			updatedAt: new Date(2024, 6, 5)
		}
	];

	// Dashboard metrics
	let metrics = $state({
		upcomingEvents: 0,
		pendingContracts: 0,
		followUpsNeeded: 0,
		monthlyRevenue: 0,
		activeClients: 0,
		totalPerformers: 0
	});

	// Load data and calculate metrics using $effect
	$effect(() => {
		async function loadData() {
			try {
				await Promise.all([
					events.loadUpcomingEvents(),
					clients.loadFollowUpClients(),
					performers.loadPerformers()
				]);

				metrics = {
					upcomingEvents: events.events.filter(
						(e) => e.status !== 'completed' && e.status !== 'cancelled'
					).length,
					pendingContracts: events.events.filter((e) => !e.contract.sent || !e.contract.received)
						.length,
					followUpsNeeded: clients.clients.filter((c) => c.nextFollowUp && c.nextFollowUp.date)
						.length,
					monthlyRevenue: calculateMonthlyRevenue(events.events),
					activeClients: clients.clients.filter((c) => c.status === 'active').length,
					totalPerformers: performers.performers.length
				};
			} catch (error) {
				console.error('Error loading dashboard data:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Generate dynamic welcome message based on time of day and activity
	function getWelcomeMessage() {
		const hour = new Date().getHours();
		const eventsCount = metrics.upcomingEvents;
		const pendingCount = metrics.pendingContracts;

		let greeting = '';
		if (hour < 12) {
			greeting = 'Good morning';
		} else if (hour < 17) {
			greeting = 'Good afternoon';
		} else {
			greeting = 'Good evening';
		}

		if (eventsCount > 0 && pendingCount > 0) {
			return `${greeting}! You have ${eventsCount} upcoming events and ${pendingCount} contracts to review.`;
		} else if (eventsCount > 0) {
			return `${greeting}! You have ${eventsCount} upcoming events to manage.`;
		} else if (pendingCount > 0) {
			return `${greeting}! You have ${pendingCount} contracts that need your attention.`;
		} else {
			return `${greeting}! All caught up on your events and contracts. Great work!`;
		}
	}

	// Helper function to calculate monthly revenue
	function calculateMonthlyRevenue(events: any[]) {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

		return events
			.filter(
				(event) =>
					event.date instanceof Date &&
					event.date >= startOfMonth &&
					event.date <= endOfMonth &&
					event.status !== 'cancelled'
			)
			.reduce((sum, event) => sum + (event.payment?.totalValue || 0), 0);
	}
</script>

<svelte:head>
	<title>Dashboard | Ringmaster</title>
</svelte:head>

<div class="page-container" data-page="dashboard">
	<!-- Hero section with Welcome + Voice Import -->
	<div class="hero-section animate-fade-in">
		<!-- Welcome Card -->
		<div class="welcome-card glass">
			<div class="welcome-gradient"></div>
			<div class="welcome-content">
				<h1 class="welcome-title">Welcome, Austen! 👋</h1>
				<p class="welcome-message">{getWelcomeMessage()}</p>
				<div class="welcome-stats">
					<div class="stat-badge">
						<span class="stat-label">Today</span>
						<span class="stat-value">{format(new Date(), 'MMM d, yyyy')}</span>
					</div>
					<div class="stat-badge">
						<span class="stat-label">This Week</span>
						<span class="stat-value">{metrics.upcomingEvents} events</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Voice Import Card -->
		<div class="voice-import-hero">
			<VoiceImport />
		</div>
	</div>

	{#if loading}
		<div class="loading-container">
			<LoadingSpinner size="lg" />
		</div>
	{:else}
		<!-- Animated metric cards -->
		<div class="metrics-grid animate-slide-up">
			<div class="delay-100">
				<DashboardCard
					title="Upcoming Events"
					value={metrics.upcomingEvents}
					icon="calendar"
					color="flame"
					link="/events?filter=upcoming"
				/>
			</div>
			<div class="delay-200">
				<DashboardCard
					title="Pending Contracts"
					value={metrics.pendingContracts}
					icon="file-text"
					color="gold"
					link="/events?filter=pending-contracts"
				/>
			</div>
			<div class="delay-300">
				<DashboardCard
					title="Follow-Ups Needed"
					value={metrics.followUpsNeeded}
					icon="bell"
					color="red"
					link="/clients?filter=follow-up"
				/>
			</div>
		</div>

		<div class="metrics-grid animate-slide-up delay-200">
			<div class="delay-100">
				<DashboardCard
					title="Monthly Revenue"
					value={metrics.monthlyRevenue}
					icon="dollar-sign"
					color="green"
					isCurrency={true}
				/>
			</div>
			<div class="delay-200">
				<DashboardCard
					title="Active Clients"
					value={metrics.activeClients}
					icon="users"
					color="royal"
					link="/clients?filter=active"
				/>
			</div>
			<div class="delay-300">
				<DashboardCard
					title="Total Performers"
					value={metrics.totalPerformers}
					icon="star"
					color="cyan"
					link="/performers"
				/>
			</div>
		</div>

		<!-- Main widgets sections -->
		<div class="section-grid animate-fade-in delay-300">
			<div class="card-base card-hover">
				<div class="card-header widget-header-flame">
					<h3 class="widget-title">Upcoming Events</h3>
				</div>
				<div class="card-body custom-scrollbar widget-content">
					<UpcomingEvents
						events={events.events
							.filter((e) => e.status !== 'completed' && e.status !== 'cancelled')
							.slice(0, 5)}
					/>
				</div>
			</div>

			<div class="card-base card-hover">
				<div class="card-header widget-header-royal">
					<h3 class="widget-title">Your Tasks</h3>
				</div>
				<div class="card-body custom-scrollbar widget-content">
					<TaskList />
				</div>
			</div>

			<div class="card-base card-hover">
				<div class="card-header widget-header-gold">
					<h3 class="widget-title">Follow-Ups Needed</h3>
				</div>
				<div class="card-body custom-scrollbar widget-content">
					<FollowUpList
						clients={clients.clients
							.filter((c) => c.nextFollowUp && c.nextFollowUp.date)
							.slice(0, 5)}
					/>
				</div>
			</div>

			<div class="card-base card-hover">
				<div class="card-header widget-header-cyan">
					<h3 class="widget-title">Recent Activity</h3>
				</div>
				<div class="card-body custom-scrollbar widget-content">
					<RecentActivity />
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Hero Section */
	.hero-section {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
	}

	@media (min-width: 1024px) {
		.hero-section {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Welcome Card */
	.welcome-card {
		position: relative;
		overflow: hidden;
		padding: var(--spacing-xl);
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-soft-lg);
		border: 1px solid rgba(251, 146, 60, 0.3);
		min-height: 300px;
		display: flex;
		flex-direction: column;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(12px);
	}

	:global(.dark) .welcome-card {
		background: rgba(17, 24, 39, 0.8);
		border: 1px solid rgba(249, 115, 22, 0.3);
		box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(249, 115, 22, 0.1);
	}

	.welcome-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(249, 115, 22, 0.08),
			rgba(234, 179, 8, 0.08),
			rgba(168, 85, 247, 0.08)
		);
		animation: gradientShift 10s ease infinite;
	}

	:global(.dark) .welcome-gradient {
		background: linear-gradient(
			135deg,
			rgba(249, 115, 22, 0.15),
			rgba(234, 179, 8, 0.12),
			rgba(168, 85, 247, 0.15)
		);
	}

	@keyframes gradientShift {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.welcome-content {
		position: relative;
		z-index: 1;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.welcome-title {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		margin-bottom: var(--spacing-md);
		background: linear-gradient(
			to right,
			var(--color-flame-600),
			var(--color-gold-500),
			var(--color-royal-600)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	:global(.dark) .welcome-title {
		background: linear-gradient(
			to right,
			var(--color-flame-400),
			var(--color-gold-400),
			var(--color-royal-400)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.welcome-message {
		color: var(--color-gray-700);
		font-size: 1.125rem;
		line-height: 1.6;
		margin-bottom: var(--spacing-lg);
	}

	:global(.dark) .welcome-message {
		color: var(--color-gray-300);
	}

	.welcome-stats {
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
		margin-top: auto;
	}

	.stat-badge {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		padding: var(--spacing-md) var(--spacing-lg);
		background: rgba(255, 255, 255, 0.5);
		border: 1px solid var(--color-flame-200);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(8px);
	}

	:global(.dark) .stat-badge {
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(249, 115, 22, 0.4);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05);
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-gray-500);
	}

	:global(.dark) .stat-label {
		color: var(--color-gray-400);
	}

	.stat-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-flame-600);
	}

	:global(.dark) .stat-value {
		color: var(--color-flame-400);
	}

	/* Voice Import Hero */
	.voice-import-hero {
		display: flex;
		align-items: stretch;
		width: 100%;
	}

	.voice-import-hero :global(.voice-import-widget) {
		width: 100%;
		min-height: 300px;
	}

	/* Loading State */
	.loading-container {
		display: flex;
		justify-content: center;
		padding: 3rem 0;
	}

	/* Metrics Grid */
	.metrics-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.metrics-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Section Grid */
	.section-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 1024px) {
		.section-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Widget Headers */
	.widget-header-flame {
		background: linear-gradient(to right, rgba(249, 115, 22, 0.05), transparent);
	}

	:global(.dark) .widget-header-flame {
		background: linear-gradient(to right, rgba(249, 115, 22, 0.1), transparent);
	}

	.widget-header-royal {
		background: linear-gradient(to right, rgba(168, 85, 247, 0.05), transparent);
	}

	:global(.dark) .widget-header-royal {
		background: linear-gradient(to right, rgba(168, 85, 247, 0.1), transparent);
	}

	.widget-header-gold {
		background: linear-gradient(to right, rgba(234, 179, 8, 0.05), transparent);
	}

	:global(.dark) .widget-header-gold {
		background: linear-gradient(to right, rgba(234, 179, 8, 0.1), transparent);
	}

	.widget-header-cyan {
		background: linear-gradient(to right, rgba(6, 182, 212, 0.05), transparent);
	}

	:global(.dark) .widget-header-cyan {
		background: linear-gradient(to right, rgba(6, 182, 212, 0.1), transparent);
	}

	.widget-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-gray-900);
	}

	:global(.dark) .widget-title {
		color: var(--color-gray-100);
	}

	.widget-content {
		max-height: 24rem;
		overflow-y: auto;
	}
</style>
