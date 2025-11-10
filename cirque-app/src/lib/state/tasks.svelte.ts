// src/lib/state/tasks.svelte.ts
// Modern Svelte 5 implementation using runes
import { browser } from '$app/environment';
import type { Task } from '../types';
import { db_service } from '../services/database';

/**
 * Tasks Manager - Svelte 5 Runes Implementation
 * Manages task/todo items with full CRUD operations and optimistic updates
 */
class TasksManager {
	#tasks = $state<Task[]>([]);
	#selectedTask = $state<Task | null>(null);
	#loading = $state(false);
	#error = $state<string | null>(null);

	/**
	 * Get all tasks
	 */
	get tasks(): Task[] {
		return this.#tasks;
	}

	/**
	 * Get the currently selected task
	 */
	get selectedTask(): Task | null {
		return this.#selectedTask;
	}

	/**
	 * Get loading state
	 */
	get loading(): boolean {
		return this.#loading;
	}

	/**
	 * Get error state
	 */
	get error(): string | null {
		return this.#error;
	}

	/**
	 * Load all tasks from database
	 */
	async loadTasks() {
		this.#loading = true;
		this.#error = null;

		try {
			this.#tasks = await db_service.task.getAll();
		} catch (error) {
			console.error('Error loading tasks:', error);
			this.#error = 'Failed to load tasks';
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Load a single task by ID
	 */
	async loadTask(id: string) {
		this.#loading = true;
		this.#error = null;

		try {
			const task = await db_service.task.get(id);
			if (!task) {
				throw new Error('Task not found');
			}
			this.#selectedTask = task;
		} catch (error) {
			console.error(`Error loading task ${id}:`, error);
			this.#error = 'Failed to load task';
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Add a new task
	 */
	async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		this.#loading = true;
		this.#error = null;

		try {
			const id = await db_service.task.add(task);
			const newTask = await db_service.task.get(id);

			if (newTask) {
				this.#tasks = [...this.#tasks, newTask];
			}

			return id;
		} catch (error) {
			console.error('Error adding task:', error);
			this.#error = 'Failed to add task';
			throw error;
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Update a task with optimistic updates
	 */
	async updateTask(id: string, updates: Partial<Task>) {
		// Store original values for potential rollback
		const taskIndex = this.#tasks.findIndex((t) => t.id === id);
		const originalTask = taskIndex !== -1 ? { ...this.#tasks[taskIndex] } : null;
		const originalSelected = this.#selectedTask?.id === id ? { ...this.#selectedTask } : null;

		// Optimistic update - immediately update UI
		if (taskIndex !== -1) {
			this.#tasks[taskIndex] = { ...this.#tasks[taskIndex], ...updates };
		}
		if (this.#selectedTask?.id === id) {
			this.#selectedTask = { ...this.#selectedTask, ...updates };
		}

		this.#loading = true;
		this.#error = null;

		try {
			await db_service.task.update(id, updates);

			// Fetch updated task to ensure consistency
			const updatedTask = await db_service.task.get(id);

			if (updatedTask) {
				// Update with confirmed data from database
				const index = this.#tasks.findIndex((t) => t.id === id);
				if (index !== -1) {
					this.#tasks[index] = updatedTask;
				}
				if (this.#selectedTask?.id === id) {
					this.#selectedTask = updatedTask;
				}
			}
		} catch (error) {
			console.error(`Error updating task ${id}:`, error);
			this.#error = 'Failed to update task';

			// Rollback optimistic update on error
			if (originalTask && taskIndex !== -1) {
				this.#tasks[taskIndex] = originalTask;
			}
			if (originalSelected) {
				this.#selectedTask = originalSelected;
			}

			throw error;
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Delete a task
	 */
	async deleteTask(id: string) {
		this.#loading = true;
		this.#error = null;

		try {
			await db_service.task.delete(id);

			this.#tasks = this.#tasks.filter((t) => t.id !== id);
			if (this.#selectedTask?.id === id) {
				this.#selectedTask = null;
			}
		} catch (error) {
			console.error(`Error deleting task ${id}:`, error);
			this.#error = 'Failed to delete task';
			throw error;
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Load tasks for a specific user
	 */
	async loadUserTasks(userId: string) {
		this.#loading = true;
		this.#error = null;

		try {
			this.#tasks = await db_service.task.getByUser(userId);
		} catch (error) {
			console.error(`Error loading tasks for user ${userId}:`, error);
			this.#error = 'Failed to load user tasks';
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Load upcoming tasks for a user within specified days
	 */
	async loadUpcomingTasks(userId: string, days: number = 7) {
		this.#loading = true;
		this.#error = null;

		try {
			this.#tasks = await db_service.task.getUpcoming(userId, days);
		} catch (error) {
			console.error(`Error loading upcoming tasks for user ${userId}:`, error);
			this.#error = 'Failed to load upcoming tasks';
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Clear the selected task
	 */
	clearSelectedTask() {
		this.#selectedTask = null;
	}

	/**
	 * Clear error state
	 */
	clearError() {
		this.#error = null;
	}
}

// Export singleton instance - only create in browser to avoid SSR issues
export const tasks = browser ? new TasksManager() : ({
	tasks: [],
	selectedTask: null,
	loading: false,
	error: null,
	loadTasks: async () => {},
	loadTask: async () => {},
	addTask: async () => '',
	updateTask: async () => {},
	deleteTask: async () => {},
	loadUserTasks: async () => {},
	loadUpcomingTasks: async () => {},
	clearSelectedTask: () => {},
	clearError: () => {}
} as unknown as TasksManager);
