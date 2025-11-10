<!-- src/lib/components/dashboard/UpcomingEvents.svelte -->
<script lang="ts">
	import { format } from 'date-fns';
	import type { Event } from '$lib/types';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		events: Event[];
	}

	const { events }: Props = $props();

	function getStatusColor(status: Event['status']): string {
		return status; // Return the status itself, we'll use it as data attribute
	}

	function getStatusLabel(status: Event['status']): string {
		switch (status) {
			case 'confirmed':
				return 'Confirmed';
			case 'deposit-received':
				return 'Deposit Received';
			case 'inquiry':
				return 'Inquiry';
			case 'completed':
				return 'Completed';
			case 'cancelled':
				return 'Cancelled';
			default:
				return status;
		}
	}

	function viewEvent(id: string) {
		goto(`/events/${id}`);
	}
</script>

<div class="upcoming-events" data-component="UpcomingEvents">
	{#if events.length === 0}
		<div class="empty-state">
			<p>No upcoming events found</p>
		</div>
	{:else}
		<ul class="events-list">
			{#each events as event}
				<li class="event-item">
					<button
						type="button"
						class="event-button"
						onclick={() => viewEvent(event.id)}
						onkeydown={(e) => e.key === 'Enter' && viewEvent(event.id)}
					>
						<div class="event-content">
							<div class="event-details">
								<p class="event-name">{event.name}</p>
								<p class="event-date">{format(event.date, 'MMM d, yyyy')}</p>
								<p class="event-meta">
									<span class="meta-item">
										<Icon name="users" size={14} extraClass="mr-1" />
										{event.performers.length} performers
									</span>
									<span class="meta-item">
										<Icon name="map-pin" size={14} extraClass="mr-1" />
										{event.location.address.split(',')[0]}
									</span>
								</p>
							</div>
							<div class="event-status">
								<span class="status-badge" data-status={getStatusColor(event.status)}>
									{getStatusLabel(event.status)}
								</span>
							</div>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="view-all">
		<a href="/events" class="view-all-link">
			View all events
			<Icon name="arrow-right" size={16} extraClass="ml-1" />
		</a>
	</div>
</div>

<style>
	.upcoming-events {
		width: 100%;
	}

	.empty-state {
		padding: 1rem 0;
		text-align: center;
		color: var(--color-gray-500);
	}

	:global(.dark) .empty-state {
		color: var(--color-gray-400);
	}

	.events-list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid var(--color-gray-200);
	}

	:global(.dark) .events-list {
		border-color: var(--color-gray-700);
	}

	.event-item {
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .event-item {
		border-color: var(--color-gray-700);
	}

	.event-button {
		width: 100%;
		text-align: left;
		padding: 0.75rem 0;
		cursor: pointer;
		background: transparent;
		border: none;
		transition: background-color 0.2s ease;
	}

	.event-button:hover {
		background-color: var(--color-gray-50);
	}

	:global(.dark) .event-button:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.event-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.event-details {
		flex: 1;
	}

	.event-name {
		font-weight: 500;
		color: var(--color-gray-900);
		margin-bottom: 0.25rem;
	}

	:global(.dark) .event-name {
		color: var(--color-gray-100);
	}

	.event-date {
		font-size: 0.875rem;
		color: var(--color-gray-600);
		margin-bottom: 0.25rem;
	}

	:global(.dark) .event-date {
		color: var(--color-gray-400);
	}

	.event-meta {
		font-size: 0.875rem;
		color: var(--color-gray-500);
		margin-top: 0.25rem;
	}

	:global(.dark) .event-meta {
		color: var(--color-gray-400);
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		margin-right: 0.75rem;
	}

	.event-status {
		flex-shrink: 0;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border-radius: var(--radius-full, 9999px);
		font-weight: 500;
	}

	.status-badge[data-status='confirmed'] {
		background-color: var(--color-green-100);
		color: var(--color-green-800);
	}

	:global(.dark) .status-badge[data-status='confirmed'] {
		background-color: rgba(34, 197, 94, 0.2);
		color: var(--color-green-400);
	}

	.status-badge[data-status='deposit-received'] {
		background-color: var(--color-blue-100);
		color: var(--color-blue-800);
	}

	:global(.dark) .status-badge[data-status='deposit-received'] {
		background-color: rgba(59, 130, 246, 0.2);
		color: var(--color-blue-400);
	}

	.status-badge[data-status='inquiry'] {
		background-color: var(--color-gray-100);
		color: var(--color-gray-800);
	}

	:global(.dark) .status-badge[data-status='inquiry'] {
		background-color: rgba(156, 163, 175, 0.2);
		color: var(--color-gray-400);
	}

	.status-badge[data-status='completed'] {
		background-color: var(--color-purple-100);
		color: var(--color-purple-800);
	}

	:global(.dark) .status-badge[data-status='completed'] {
		background-color: rgba(168, 85, 247, 0.2);
		color: var(--color-purple-400);
	}

	.status-badge[data-status='cancelled'] {
		background-color: var(--color-red-100);
		color: var(--color-red-800);
	}

	:global(.dark) .status-badge[data-status='cancelled'] {
		background-color: rgba(239, 68, 68, 0.2);
		color: var(--color-red-400);
	}

	.view-all {
		margin-top: 0.75rem;
		text-align: right;
	}

	.view-all-link {
		color: var(--color-blue-600);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: color 0.2s ease;
	}

	.view-all-link:hover {
		color: var(--color-blue-700);
		text-decoration: underline;
	}

	:global(.dark) .view-all-link {
		color: var(--color-blue-400);
	}

	:global(.dark) .view-all-link:hover {
		color: var(--color-blue-300);
	}
</style>
