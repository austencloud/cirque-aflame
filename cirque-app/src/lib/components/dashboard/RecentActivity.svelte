<script lang="ts">
	import { format, formatDistanceToNow } from 'date-fns';
	import Icon from '$lib/components/ui/Icon.svelte';

	// Define the structure for an activity item
	interface ActivityItem {
		id: string;
		type: 'client' | 'event' | 'performer' | 'task' | 'contract' | 'payment';
		action: 'created' | 'updated' | 'completed' | 'cancelled' | 'sent' | 'received';
		entityId: string;
		entityName: string;
		timestamp: Date;
		user: {
			id: string;
			name: string;
		};
	}

	// State variables
	let activityItems = $state<ActivityItem[]>([]);
	let loading = $state(true);

	// Fetch recent activity data when the component mounts
	$effect(() => {
		async function loadActivity() {
			// In a real app, this would fetch from a database or API
			// Simulate fetching recent activity with a delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Mock data for demonstration
			activityItems = [
				{
					id: '1',
					type: 'event',
					action: 'created',
					entityId: 'event1',
					entityName: 'Pritzker Elementary Back to School Bash',
					timestamp: new Date(2024, 6, 5), // July 5, 2024
					user: { id: 'user1', name: 'Austen Cloud' }
				},
				{
					id: '2',
					type: 'contract',
					action: 'sent',
					entityId: 'event2',
					entityName: 'YPO Yearly Celebration',
					timestamp: new Date(2024, 6, 2), // July 2, 2024
					user: { id: 'user1', name: 'Austen Cloud' }
				},
				{
					id: '3',
					type: 'payment',
					action: 'received',
					entityId: 'event2',
					entityName: 'YPO Yearly Celebration',
					timestamp: new Date(2024, 6, 1), // July 1, 2024
					user: { id: 'user1', name: 'Austen Cloud' }
				},
				{
					id: '4',
					type: 'client',
					action: 'created',
					entityId: 'client1',
					entityName: 'Schwab Rehab Hospital',
					timestamp: new Date(2024, 5, 25), // June 25, 2024
					user: { id: 'user1', name: 'Austen Cloud' }
				},
				{
					id: '5',
					type: 'task',
					action: 'completed',
					entityId: 'task1',
					entityName: 'Follow up with Agudath Jacob Synagogue',
					timestamp: new Date(2024, 5, 20), // June 20, 2024
					user: { id: 'user2', name: 'Robert Bershadsky' }
				}
			];

			loading = false;
		}

		loadActivity();
	});

	// Function to determine the appropriate icon based on activity type
	function getIconForActivityType(type: ActivityItem['type']): string {
		switch (type) {
			case 'client':
				return 'user';
			case 'event':
				return 'calendar';
			case 'performer':
				return 'star';
			case 'task':
				return 'check-square';
			case 'contract':
				return 'file-text';
			case 'payment':
				return 'dollar-sign';
			default:
				return 'activity'; // Default icon
		}
	}

	// Function to generate a descriptive string for the activity
	function getActivityDescription(item: ActivityItem): string {
		const action = item.action;
		const type = item.type;

		// Generate descriptive text based on type and action
		switch (`${type}-${action}`) {
			case 'event-created':
				return `created new event "${item.entityName}"`;
			case 'client-created':
				return `added new client "${item.entityName}"`;
			case 'performer-created':
				return `added new performer "${item.entityName}"`;
			case 'task-completed':
				return `completed task "${item.entityName}"`;
			case 'contract-sent':
				return `sent contract for "${item.entityName}"`;
			case 'payment-received':
				return `recorded payment for "${item.entityName}"`;
			case 'event-updated':
				return `updated event "${item.entityName}"`;
			case 'event-cancelled':
				return `cancelled event "${item.entityName}"`;
			default:
				return `${action} ${type} "${item.entityName}"`; // Fallback description
		}
	}
</script>

<div class="recent-activity" data-component="RecentActivity">
	{#if loading}
		<div class="loading-state">
			<p>Loading activity...</p>
		</div>
	{:else if activityItems.length === 0}
		<div class="empty-state">
			<p>No recent activity found</p>
		</div>
	{:else}
		<ul class="activity-list">
			{#each activityItems as item (item.id)}
				<li class="activity-item">
					<div class="activity-content">
						<div class="icon-wrapper">
							<div class="icon-circle">
								<Icon
									name={getIconForActivityType(item.type)}
									size={16}
									extraClass="text-blue-600"
								/>
							</div>
						</div>
						<div class="activity-details">
							<p class="activity-description">
								<span class="user-name">{item.user.name}</span>
								<span class="action-text"> {getActivityDescription(item)}</span>
							</p>
							<p class="activity-time" title={format(item.timestamp, 'PPpp')}>
								{formatDistanceToNow(item.timestamp, { addSuffix: true })}
							</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.recent-activity {
		width: 100%;
	}

	.loading-state,
	.empty-state {
		padding: 1rem 0;
		text-align: center;
		color: var(--color-gray-500);
	}

	:global(.dark) .loading-state,
	:global(.dark) .empty-state {
		color: var(--color-gray-400);
	}

	.activity-list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid var(--color-gray-200);
	}

	:global(.dark) .activity-list {
		border-color: var(--color-gray-700);
	}

	.activity-item {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .activity-item {
		border-color: var(--color-gray-700);
	}

	.activity-content {
		display: flex;
		gap: 0.75rem;
	}

	.icon-wrapper {
		margin-top: 0.25rem;
		flex-shrink: 0;
	}

	.icon-circle {
		height: 2rem;
		width: 2rem;
		border-radius: var(--radius-full, 9999px);
		background-color: var(--color-blue-100);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.dark) .icon-circle {
		background-color: rgba(59, 130, 246, 0.2);
	}

	.activity-details {
		flex: 1;
	}

	.activity-description {
		margin: 0;
		line-height: 1.5;
	}

	.user-name {
		font-weight: 500;
		color: var(--color-gray-900);
	}

	:global(.dark) .user-name {
		color: var(--color-gray-100);
	}

	.action-text {
		color: var(--color-gray-600);
	}

	:global(.dark) .action-text {
		color: var(--color-gray-400);
	}

	.activity-time {
		font-size: 0.875rem;
		color: var(--color-gray-500);
		margin-top: 0.25rem;
	}

	:global(.dark) .activity-time {
		color: var(--color-gray-400);
	}
</style>
