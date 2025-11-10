<!-- src/lib/components/tasks/+page.svelte -->
<script lang="ts">
	import { tasks } from '$lib/state/tasks.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { format } from 'date-fns';
	import type { Task } from '$lib/types';

	const { page } = $props<{ page: any }>();

	// State
	let loading = $state(true);
	let searchQuery = $state('');
	let filterStatus = $state<'all' | 'active' | 'completed'>('all');
	let filterPriority = $state<'all' | 'high' | 'medium' | 'low'>('all');
	let showCreateModal = $state(false);
	let saving = $state(false);
	let error = $state('');

	// Form state
	let newTaskTitle = $state('');
	let newTaskDescription = $state('');
	let newTaskDueDate = $state('');
	let newTaskPriority = $state<'low' | 'medium' | 'high'>('medium');

	// Load tasks
	$effect(() => {
		async function loadData() {
			try {
				await tasks.loadTasks();
			} catch (error) {
				console.error('Error loading tasks:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Filtered tasks
	const filteredTasks = $derived(
		tasks.tasks.filter((task) => {
			// Search filter
			if (searchQuery) {
				const search = searchQuery.toLowerCase();
				if (
					!task.title.toLowerCase().includes(search) &&
					!task.description?.toLowerCase().includes(search)
				) {
					return false;
				}
			}

			// Status filter
			if (filterStatus === 'active' && task.completed) {
				return false;
			}
			if (filterStatus === 'completed' && !task.completed) {
				return false;
			}

			// Priority filter
			if (filterPriority !== 'all' && task.priority !== filterPriority) {
				return false;
			}

			return true;
		})
	);

	// Sort tasks by due date and priority
	const sortedTasks = $derived(
		[...filteredTasks].sort((a, b) => {
			// Completed tasks go to bottom
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}

			// Sort by due date
			if (a.dueDate && b.dueDate) {
				return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
			}
			if (a.dueDate) {
				return -1;
			}
			if (b.dueDate) {
				return 1;
			}

			// Sort by priority
			const priorityOrder = { high: 0, medium: 1, low: 2 };
			return priorityOrder[a.priority] - priorityOrder[b.priority];
		})
	);

	function getPriorityBadgeClass(priority: Task['priority']): string {
		switch (priority) {
			case 'high':
				return 'priority-badge-high';
			case 'medium':
				return 'priority-badge-medium';
			case 'low':
				return 'priority-badge-low';
			default:
				return 'priority-badge-medium';
		}
	}

	function isOverdue(task: Task): boolean {
		if (!task.dueDate || task.completed) {
			return false;
		}
		return new Date(task.dueDate) < new Date();
	}

	async function toggleTaskComplete(taskId: string, currentStatus: boolean) {
		try {
			await tasks.updateTask(taskId, { completed: !currentStatus });
		} catch (error) {
			console.error('Error updating task:', error);
		}
	}

	// Form handlers
	function resetForm() {
		newTaskTitle = '';
		newTaskDescription = '';
		newTaskDueDate = '';
		newTaskPriority = 'medium';
		error = '';
	}

	function closeModal() {
		showCreateModal = false;
		resetForm();
	}

	async function handleCreateTask(e: Event) {
		e.preventDefault();

		if (!newTaskTitle.trim()) {
			error = 'Title is required';
			return;
		}

		if (!newTaskDueDate) {
			error = 'Due date is required';
			return;
		}

		saving = true;
		error = '';

		try {
			await tasks.addTask({
				title: newTaskTitle.trim(),
				description: newTaskDescription.trim() || undefined,
				dueDate: new Date(newTaskDueDate),
				priority: newTaskPriority,
				completed: false
			});

			closeModal();
		} catch (err) {
			console.error('Error creating task:', err);
			error = 'Failed to create task. Please try again.';
		} finally {
			saving = false;
		}
	}
</script>

<div class="page-container">
	<div class="page-header">
		<h1 class="page-title">Tasks</h1>
		<Button onclick={() => (showCreateModal = true)}>
			{#snippet children()}
				<Icon name="plus" size={18} extraClass="mr-1" />
				Add Task
			{/snippet}
		</Button>
	</div>

	<!-- Filters Panel -->
	<div class="filters-panel glass">
		<div class="filters-grid">
			<!-- Search -->
			<div class="search-wrapper">
				<div class="search-icon">
					<Icon name="search" size={20} extraClass="text-gray-400" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search tasks..."
					class="search-input"
				/>
			</div>

			<!-- Status Filter -->
			<div class="filter-wrapper">
				<select bind:value={filterStatus} class="filter-select">
					<option value="all">All Tasks</option>
					<option value="active">Active</option>
					<option value="completed">Completed</option>
				</select>
			</div>

			<!-- Priority Filter -->
			<div class="filter-wrapper">
				<select bind:value={filterPriority} class="filter-select">
					<option value="all">All Priorities</option>
					<option value="high">High Priority</option>
					<option value="medium">Medium Priority</option>
					<option value="low">Low Priority</option>
				</select>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="loading-container">
			<LoadingSpinner size="lg" />
		</div>
	{:else if sortedTasks.length === 0}
		<div class="empty-state glass">
			<Icon name="check-square" size={48} extraClass="empty-icon" />
			<h3 class="empty-title">No tasks found</h3>
			<p class="empty-description">
				{searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
					? 'Try adjusting your filters.'
					: 'Get started by adding your first task.'}
			</p>
		</div>
	{:else}
		<div class="tasks-list">
			{#each sortedTasks as task (task.id)}
				<div class="task-card card-base {task.completed ? 'task-completed' : ''}">
					<div class="task-content">
						<!-- Checkbox -->
						<button
							class="task-checkbox {task.completed ? 'task-checkbox-checked' : ''}"
							onclick={() => toggleTaskComplete(task.id, task.completed)}
						>
							{#if task.completed}
								<Icon name="check" size={14} extraClass="text-white" />
							{/if}
						</button>

						<!-- Task Info -->
						<div class="task-info">
							<div class="task-header">
								<div class="task-title-container">
									<p class="task-title {task.completed ? 'task-title-completed' : ''}">
										{task.title}
									</p>
									{#if task.description}
										<p class="task-description">{task.description}</p>
									{/if}
								</div>

								<!-- Priority Badge -->
								<span class="priority-badge {getPriorityBadgeClass(task.priority)}">
									{task.priority}
								</span>
							</div>

							<!-- Task Metadata -->
							<div class="task-metadata">
								{#if task.dueDate}
									<div class="metadata-item">
										<Icon name="calendar" size={14} extraClass="metadata-icon" />
										<span class={isOverdue(task) && !task.completed ? 'metadata-overdue' : ''}>
											{format(new Date(task.dueDate), 'MMM d, yyyy')}
										</span>
									</div>
								{/if}
								{#if task.relatedTo}
									<div class="metadata-item">
										<Icon name="link" size={14} extraClass="metadata-icon" />
										<span>{task.relatedTo.type}</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Results count -->
		<div class="results-count">
			Showing {sortedTasks.length}
			{sortedTasks.length === 1 ? 'task' : 'tasks'}
			{#if searchQuery || filterStatus !== 'all' || filterPriority !== 'all'}
				(filtered)
			{/if}
		</div>
	{/if}
</div>

<!-- Create Task Modal -->
{#if showCreateModal}
	<div class="modal-overlay">
		<div class="modal-content">
			<form onsubmit={handleCreateTask}>
				<!-- Modal Header -->
				<div class="modal-header">
					<h2 class="modal-title">Create New Task</h2>
					<button type="button" onclick={closeModal} class="modal-close">
						<Icon name="x" size={24} />
					</button>
				</div>

				<!-- Modal Body -->
				<div class="modal-body">
					<!-- Error Message -->
					{#if error}
						<div class="error-alert">
							<Icon name="alert-circle" size={20} extraClass="error-icon" />
							<p class="error-message">{error}</p>
						</div>
					{/if}

					<!-- Title -->
					<div class="form-group">
						<label for="title" class="form-label">
							Title
							<span class="form-required">*</span>
						</label>
						<input
							type="text"
							id="title"
							bind:value={newTaskTitle}
							required
							class="form-input"
							placeholder="Task title"
						/>
					</div>

					<!-- Description -->
					<div class="form-group">
						<label for="description" class="form-label">Description</label>
						<textarea
							id="description"
							bind:value={newTaskDescription}
							rows="3"
							class="form-input form-textarea"
							placeholder="Task description (optional)"
						></textarea>
					</div>

					<!-- Due Date and Priority -->
					<div class="form-row">
						<div class="form-group">
							<label for="dueDate" class="form-label">
								Due Date
								<span class="form-required">*</span>
							</label>
							<input type="date" id="dueDate" bind:value={newTaskDueDate} required class="form-input" />
						</div>

						<div class="form-group">
							<label for="priority" class="form-label">Priority</label>
							<select id="priority" bind:value={newTaskPriority} class="form-input form-select">
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="modal-footer">
					<Button type="button" variant="outline" onclick={closeModal} disabled={saving}>
						{#snippet children()}Cancel{/snippet}
					</Button>
					<Button type="submit" disabled={saving}>
						{#snippet children()}
							{#if saving}
								<Icon name="loader" size={18} extraClass="mr-2 animate-spin" />
								Creating...
							{:else}
								<Icon name="check" size={18} extraClass="mr-2" />
								Create Task
							{/if}
						{/snippet}
					</Button>
				</div>
			</form>
		</div>
	</div>
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
			grid-template-columns: 1fr 1fr 1fr;
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

	.empty-icon {
		color: var(--color-gray-600);
		margin: 0 auto 1rem;
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

	/* Tasks List */
	.tasks-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Task Card */
	.task-card {
		border-radius: var(--radius-2xl);
		overflow: hidden;
		transition: all var(--transition-base);
	}

	.task-completed {
		opacity: 0.7;
	}

	.task-content {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
	}

	/* Checkbox */
	.task-checkbox {
		flex-shrink: 0;
		margin-top: 0.25rem;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		border: 2px solid var(--color-gray-600);
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.task-checkbox:hover {
		border-color: var(--color-royal-500);
	}

	.task-checkbox-checked {
		background: var(--color-green-500);
		border-color: var(--color-green-500);
	}

	/* Task Info */
	.task-info {
		flex: 1;
		min-width: 0;
	}

	.task-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.task-title-container {
		flex: 1;
		min-width: 0;
	}

	.task-title {
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-gray-100);
		margin: 0 0 0.25rem 0;
		word-wrap: break-word;
	}

	.task-title-completed {
		text-decoration: line-through;
		color: var(--color-gray-500);
	}

	.task-description {
		font-size: 0.875rem;
		color: var(--color-gray-400);
		margin: 0;
	}

	/* Priority Badge */
	.priority-badge {
		flex-shrink: 0;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: capitalize;
		white-space: nowrap;
	}

	.priority-badge-high {
		background: rgba(239, 68, 68, 0.15);
		color: #f87171;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	.priority-badge-medium {
		background: rgba(245, 158, 11, 0.15);
		color: #fbbf24;
		border: 1px solid rgba(245, 158, 11, 0.3);
	}

	.priority-badge-low {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	/* Task Metadata */
	.task-metadata {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.metadata-item {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--color-gray-400);
	}

	.metadata-icon {
		flex-shrink: 0;
	}

	.metadata-overdue {
		color: #ef4444;
		font-weight: 600;
	}

	/* Results Count */
	.results-count {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-gray-400);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 50;
	}

	.modal-content {
		background: var(--color-gray-800);
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-soft-2xl);
		max-width: 42rem;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
	}

	/* Modal Header */
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-gray-700);
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-gray-100);
		margin: 0;
	}

	.modal-close {
		color: var(--color-gray-400);
		background: transparent;
		border: none;
		padding: 0.25rem;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: color var(--transition-fast);
	}

	.modal-close:hover {
		color: var(--color-gray-100);
	}

	/* Modal Body */
	.modal-body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* Error Alert */
	.error-alert {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: var(--radius-lg);
	}

	.error-icon {
		flex-shrink: 0;
		color: #ef4444;
	}

	.error-message {
		font-size: 0.875rem;
		color: #fca5a5;
		margin: 0;
	}

	/* Form Elements */
	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.form-row {
			grid-template-columns: 1fr 1fr;
		}
	}

	.form-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-100);
		margin-bottom: 0.5rem;
	}

	.form-required {
		color: #ef4444;
	}

	.form-input {
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-gray-700);
		border-radius: var(--radius-lg);
		background: var(--color-gray-900);
		color: var(--color-gray-100);
		font-size: 0.875rem;
		transition: all var(--transition-fast);
	}

	.form-input::placeholder {
		color: var(--color-gray-500);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-royal-500);
		box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
	}

	.form-textarea {
		resize: vertical;
		font-family: inherit;
	}

	.form-select {
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
		padding-right: 2.5rem;
	}

	/* Modal Footer */
	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1.5rem;
		background: rgba(17, 24, 39, 0.5);
		border-top: 1px solid var(--color-gray-700);
	}
</style>
