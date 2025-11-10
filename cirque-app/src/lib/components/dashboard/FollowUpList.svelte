<!-- src/lib/components/dashboard/FollowUpList.svelte -->
<script lang="ts">
	import { format } from 'date-fns';
	import type { Client } from '$lib/types';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { goto } from '$app/navigation';
	interface Props {
		clients: Client[];
	}
	const { clients }: Props = $props();
	function isOverdue(date: Date | null): boolean {
		if (!date) {
			return false;
		}
		return new Date() > date;
	}
	function navigateToClient(id: string) {
		goto(`/clients/${id}`);
	}
</script>

<div class="follow-up-list" data-component="FollowUpList">
	{#if clients.length === 0}
		<div class="empty-state"><p>No follow-ups needed</p></div>
	{:else}
		<ul class="clients-list">
			{#each clients as client}
				<li class="client-item">
					<button
						type="button"
						class="client-button"
						onclick={() => navigateToClient(client.id)}
						onkeydown={(e) => e.key === 'Enter' && navigateToClient(client.id)}
					>
						<div class="client-content">
							<div class="client-info">
								<p class="client-name">{client.name}</p>
								<p class="contact-person">{client.contactPerson}</p>
								{#if client.nextFollowUp.task}
									<p class="follow-up-task" data-overdue={isOverdue(client.nextFollowUp.date)}>
										{client.nextFollowUp.task}
									</p>
								{/if}
							</div>
							{#if client.nextFollowUp.date}
								<div class="follow-up-date">
									<span class="date-badge" data-overdue={isOverdue(client.nextFollowUp.date)}>
										{isOverdue(client.nextFollowUp.date)
											? 'Overdue'
											: format(client.nextFollowUp.date, 'MMM d')}
									</span>
								</div>
							{/if}
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
	<div class="view-all">
		<a href="/clients?filter=follow-up" class="view-all-link">
			View all follow-ups <Icon name="arrow-right" size={16} extraClass="ml-1" />
		</a>
	</div>
</div>

<style>
	.follow-up-list {
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
	.clients-list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid var(--color-gray-200);
	}
	:global(.dark) .clients-list {
		border-color: var(--color-gray-700);
	}
	.client-item {
		border-bottom: 1px solid var(--color-gray-200);
	}
	:global(.dark) .client-item {
		border-color: var(--color-gray-700);
	}
	.client-button {
		width: 100%;
		padding: 0.75rem 0;
		text-align: left;
		background: transparent;
		border: none;
		cursor: pointer;
		border-radius: var(--radius-md, 6px);
		transition: all 0.2s ease;
	}
	.client-button:hover {
		background-color: var(--color-gray-50);
	}
	.client-button:focus {
		outline: none;
		box-shadow: 0 0 0 2px var(--color-blue-300);
	}
	:global(.dark) .client-button:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}
	:global(.dark) .client-button:focus {
		box-shadow: 0 0 0 2px var(--color-blue-600);
	}
	.client-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}
	.client-info {
		flex: 1;
	}
	.client-name {
		font-weight: 500;
		color: var(--color-gray-900);
		margin-bottom: 0.25rem;
	}
	:global(.dark) .client-name {
		color: var(--color-gray-100);
	}
	.contact-person {
		font-size: 0.875rem;
		color: var(--color-gray-600);
		margin-bottom: 0.25rem;
	}
	:global(.dark) .contact-person {
		color: var(--color-gray-400);
	}
	.follow-up-task {
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
	.follow-up-task[data-overdue='false'] {
		color: var(--color-gray-600);
	}
	.follow-up-task[data-overdue='true'] {
		color: var(--color-red-600);
	}
	:global(.dark) .follow-up-task[data-overdue='false'] {
		color: var(--color-gray-400);
	}
	:global(.dark) .follow-up-task[data-overdue='true'] {
		color: var(--color-red-400);
	}
	.follow-up-date {
		flex-shrink: 0;
	}
	.date-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border-radius: var(--radius-full, 9999px);
		font-weight: 500;
	}
	.date-badge[data-overdue='false'] {
		background-color: var(--color-blue-100);
		color: var(--color-blue-800);
	}
	.date-badge[data-overdue='true'] {
		background-color: var(--color-red-100);
		color: var(--color-red-800);
	}
	:global(.dark) .date-badge[data-overdue='false'] {
		background-color: rgba(59, 130, 246, 0.2);
		color: var(--color-blue-400);
	}
	:global(.dark) .date-badge[data-overdue='true'] {
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
