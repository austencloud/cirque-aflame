<script lang="ts">
	import { format } from 'date-fns';
	import { fade } from 'svelte/transition';
	import type { Task } from '$lib/types';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { tasks } from '$lib/state/tasks.svelte';

	let loading = $state(false);

	// Sort tasks by priority and due date
	const sortedTasks = $derived(
		[...tasks.tasks].sort((a, b) => {
			// First sort by completion
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}

			// Then by priority
			const priorityOrder = { high: 0, medium: 1, low: 2 };
			if (a.priority !== b.priority) {
				return priorityOrder[a.priority] - priorityOrder[b.priority];
			}

			// Finally by due date
			// Handle potential null or invalid dates defensively
			const dateA = a.dueDate instanceof Date ? a.dueDate.getTime() : 0;
			const dateB = b.dueDate instanceof Date ? b.dueDate.getTime() : 0;
			return dateA - dateB;
		})
	);

	async function toggleTaskComplete(taskId: string, currentStatus: boolean) {
		loading = true;
		try {
			await tasks.updateTask(taskId, { completed: !currentStatus });
			// Optionally refetch tasks or rely on store reactivity if implemented
		} catch (error) {
			console.error('Error updating task:', error);
			// Optionally revert UI state if update fails
		} finally {
			loading = false;
		}
	}

	function isOverdue(task: Task): boolean {
		if (task.completed || !(task.dueDate instanceof Date)) {
			return false;
		}
		return new Date() > task.dueDate;
	}

	// Helper function to get icon name based on relatedTo type
	function getRelatedIcon(type: string | undefined): string {
		switch (type) {
			case 'client':
				return 'user';
			case 'event':
				return 'calendar';
			case 'performer':
				return 'star';
			case 'agent':
				return 'briefcase'; // Assuming 'agent' is a possibility
			default:
				return 'link'; // Default icon
		}
	}
</script>

<div class="task-list" data-component="TaskList">
	{#if tasks.tasks.length === 0}
		<div class="empty-state"><p>No tasks found</p></div>
	{:else}
		<ul class="tasks-container">
			{#each sortedTasks as task (task.id)}
				<li
					transition:fade
					class="task-item"
					data-completed={task.completed}
					data-overdue={isOverdue(task)}
				>
					<div class="task-content">
						<div class="checkbox-container">
							<button
								class="task-checkbox"
								data-completed={task.completed}
								aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
								disabled={loading}
								onclick={() => toggleTaskComplete(task.id, task.completed)}
							>
								{#if task.completed} <Icon name="check" size={12} extraClass="text-white" /> {/if}
							</button>
						</div>
						<div class="task-details">
							<div class="task-header">
								<p class="task-title" data-completed={task.completed}>{task.title}</p>
								<span class="priority-badge" data-priority={task.priority}> {task.priority} </span>
							</div>
							{#if task.description}
								<p class="task-description" data-completed={task.completed}>{task.description}</p>
							{/if}
							<div class="task-meta">
								<Icon name="calendar" size={12} extraClass="mr-1" />
								{#if task.dueDate instanceof Date}
									<span class="due-date" data-overdue={isOverdue(task) && !task.completed}>
										Due: {format(task.dueDate, 'MMM d, yyyy')}
									</span>
								{:else}
									<span>No due date</span>
								{/if}
								{#if task.relatedTo}
									<span class="related-info">
										<Icon name={getRelatedIcon(task.relatedTo.type)} size={12} extraClass="mr-1" />
										{task.relatedTo.type}
									</span>
								{/if}
							</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
	<div class="view-all">
		<a href="/tasks" class="view-all-link">
			View all tasks <Icon name="arrow-right" size={16} extraClass="ml-1" />
		</a>
	</div>
</div>

<style>
	.task-list {
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
	.tasks-container {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.task-item {
		padding: 0.75rem;
		border: 1px solid var(--color-gray-200);
		border-radius: var(--radius-md, 6px);
		transition: all 0.2s ease;
	}
	.task-item[data-completed='true'] {
		background-color: var(--color-gray-50);
		border-color: var(--color-gray-200);
	}
	.task-item[data-completed='false'][data-overdue='true'] {
		border-color: var(--color-red-200);
		background-color: var(--color-red-50);
	}
	:global(.dark) .task-item {
		border-color: var(--color-gray-700);
		background-color: transparent;
	}
	:global(.dark) .task-item[data-completed='true'] {
		background-color: rgba(255, 255, 255, 0.05);
		border-color: var(--color-gray-700);
	}
	:global(.dark) .task-item[data-completed='false'][data-overdue='true'] {
		border-color: var(--color-red-700);
		background-color: rgba(239, 68, 68, 0.1);
	}
	.task-content {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}
	.checkbox-container {
		margin-top: 0.25rem;
	}
	.task-checkbox {
		height: 1.25rem;
		width: 1.25rem;
		border-radius: var(--radius-full, 9999px);
		border: 1px solid var(--color-gray-300);
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.task-checkbox:hover {
		border-color: var(--color-gray-400);
	}
	.task-checkbox[data-completed='true'] {
		background-color: var(--color-green-500);
		border-color: var(--color-green-500);
	}
	.task-checkbox:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	:global(.dark) .task-checkbox {
		border-color: var(--color-gray-600);
	}
	:global(.dark) .task-checkbox:hover {
		border-color: var(--color-gray-500);
	}
	.task-details {
		flex: 1;
	}
	.task-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.task-title {
		font-weight: 500;
		color: var(--color-gray-900);
		margin: 0;
	}
	.task-title[data-completed='true'] {
		text-decoration: line-through;
		color: var(--color-gray-500);
	}
	:global(.dark) .task-title {
		color: var(--color-gray-100);
	}
	:global(.dark) .task-title[data-completed='true'] {
		color: var(--color-gray-500);
	}
	.priority-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		border-radius: var(--radius-full, 9999px);
		font-weight: 500;
		flex-shrink: 0;
	}
	.priority-badge[data-priority='high'] {
		background-color: var(--color-red-100);
		color: var(--color-red-800);
	}
	.priority-badge[data-priority='medium'] {
		background-color: var(--color-amber-100);
		color: var(--color-amber-800);
	}
	.priority-badge[data-priority='low'] {
		background-color: var(--color-blue-100);
		color: var(--color-blue-800);
	}
	:global(.dark) .priority-badge[data-priority='high'] {
		background-color: rgba(239, 68, 68, 0.2);
		color: var(--color-red-400);
	}
	:global(.dark) .priority-badge[data-priority='medium'] {
		background-color: rgba(245, 158, 11, 0.2);
		color: var(--color-amber-400);
	}
	:global(.dark) .priority-badge[data-priority='low'] {
		background-color: rgba(59, 130, 246, 0.2);
		color: var(--color-blue-400);
	}
	.task-description {
		font-size: 0.875rem;
		color: var(--color-gray-600);
		margin-top: 0.25rem;
	}
	.task-description[data-completed='true'] {
		text-decoration: line-through;
		color: var(--color-gray-400);
	}
	:global(.dark) .task-description {
		color: var(--color-gray-400);
	}
	:global(.dark) .task-description[data-completed='true'] {
		color: var(--color-gray-600);
	}
	.task-meta {
		display: flex;
		align-items: center;
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: var(--color-gray-500);
		gap: 0.25rem;
	}
	:global(.dark) .task-meta {
		color: var(--color-gray-400);
	}
	.due-date[data-overdue='true'] {
		color: var(--color-red-600);
		font-weight: 500;
	}
	:global(.dark) .due-date[data-overdue='true'] {
		color: var(--color-red-400);
	}
	.related-info {
		margin-left: 0.75rem;
		display: flex;
		align-items: center;
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
