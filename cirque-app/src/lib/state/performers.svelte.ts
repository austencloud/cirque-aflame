// src/lib/state/performers.svelte.ts
// Svelte 5 compatible using writable stores for SSR compatibility
import { writable, get } from 'svelte/store';
import type { Performer, PerformerSkillCategory, AvailabilityStatus } from '../types';
import { db_service } from '../services/database';

/**
 * Performers State - Svelte 5 Compatible with SSR
 * Using writable stores for module-level reactive state
 */

// Module-level stores (compatible with SSR)
const _performers = writable<Performer[]>([]);
const _selectedPerformer = writable<Performer | null>(null);
const _loading = writable(false);
const _error = writable<string | null>(null);

/**
 * Performers manager object with reactive stores and methods
 */
export const performers = {
	/**
	 * Subscribe to all performers
	 */
	subscribe: _performers.subscribe,

	/**
	 * Get the currently selected performer
	 */
	get selectedPerformer() {
		return get(_selectedPerformer);
	},

	/**
	 * Get loading state
	 */
	get loading() {
		return get(_loading);
	},

	/**
	 * Get error state
	 */
	get error() {
		return get(_error);
	},

	/**
	 * Get all performers (non-reactive)
	 */
	get performers() {
		return get(_performers);
	},

	/**
	 * Reactive selected performer store
	 */
	selectedPerformerStore: { subscribe: _selectedPerformer.subscribe },

	/**
	 * Load all performers from database
	 */
	async loadPerformers() {
		_loading.set(true);
		_error.set(null);

		try {
			const data = await db_service.performer.getAll();
			_performers.set(data);
		} catch (error) {
			console.error('Error loading performers:', error);
			_error.set('Failed to load performers');
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Load a single performer by ID
	 */
	async loadPerformer(id: string) {
		_loading.set(true);
		_error.set(null);

		try {
			const performer = await db_service.performer.get(id);

			if (!performer) {
				throw new Error('Performer not found');
			}

			_selectedPerformer.set(performer);
		} catch (error) {
			console.error(`Error loading performer ${id}:`, error);
			_error.set('Failed to load performer');
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Add a new performer
	 */
	async addPerformer(performer: Omit<Performer, 'id' | 'createdAt' | 'updatedAt'>) {
		_loading.set(true);
		_error.set(null);

		try {
			const id = await db_service.performer.add(performer);
			const newPerformer = await db_service.performer.get(id);

			if (newPerformer) {
				_performers.update((current) => [...current, newPerformer]);
				_selectedPerformer.set(newPerformer);
			}

			return id;
		} catch (error) {
			console.error('Error adding performer:', error);
			_error.set('Failed to add performer');
			throw error;
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Update an existing performer
	 */
	async updatePerformer(id: string, updates: Partial<Performer>) {
		_loading.set(true);
		_error.set(null);

		try {
			await db_service.performer.update(id, updates);
			const updatedPerformer = await db_service.performer.get(id);

			if (updatedPerformer) {
				// Update in performers array
				_performers.update((current) => {
					const index = current.findIndex((p) => p.id === id);
					if (index !== -1) {
						current[index] = updatedPerformer;
					}
					return current;
				});

				// Update selected if it's the same performer
				const selectedId = get(_selectedPerformer)?.id;
				if (selectedId === id) {
					_selectedPerformer.set(updatedPerformer);
				}
			}
		} catch (error) {
			console.error(`Error updating performer ${id}:`, error);
			_error.set('Failed to update performer');
			throw error;
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Delete a performer
	 */
	async deletePerformer(id: string) {
		_loading.set(true);
		_error.set(null);

		try {
			await db_service.performer.delete(id);

			_performers.update((current) => current.filter((p) => p.id !== id));

			const selectedId = get(_selectedPerformer)?.id;
			if (selectedId === id) {
				_selectedPerformer.set(null);
			}
		} catch (error) {
			console.error(`Error deleting performer ${id}:`, error);
			_error.set('Failed to delete performer');
			throw error;
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Load performers by skill category
	 */
	async loadPerformersBySkill(category: PerformerSkillCategory) {
		_loading.set(true);
		_error.set(null);

		try {
			const data = await db_service.performer.getBySkill(category);
			_performers.set(data);
		} catch (error) {
			console.error(`Error loading performers with skill ${category}:`, error);
			_error.set(`Failed to load ${category} performers`);
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Load performers available on a specific date
	 */
	async loadAvailablePerformers(date: Date) {
		_loading.set(true);
		_error.set(null);

		try {
			const data = await db_service.performer.getAvailableForDate(date);
			_performers.set(data);
		} catch (error) {
			console.error(`Error loading available performers for ${date}:`, error);
			_error.set('Failed to load available performers');
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Update performer availability for a specific date
	 */
	async updateAvailability(
		performerId: string,
		date: Date,
		status: AvailabilityStatus,
		notes?: string
	) {
		_loading.set(true);
		_error.set(null);

		try {
			const performer = await db_service.performer.get(performerId);

			if (!performer) {
				throw new Error('Performer not found');
			}

			const availability = [...(performer.availability || [])];

			// Find if we already have an entry for this date
			const dateString = date.toDateString();
			const existingIndex = availability.findIndex((a) => a.date.toDateString() === dateString);

			if (existingIndex >= 0) {
				// Update existing entry
				availability[existingIndex] = {
					...availability[existingIndex],
					status,
					notes
				};
			} else {
				// Add new entry
				availability.push({ date, status, notes });
			}

			// Update the performer
			await this.updatePerformer(performerId, { availability });
		} catch (error) {
			console.error(`Error updating availability for ${performerId}:`, error);
			_error.set('Failed to update availability');
			throw error;
		} finally {
			_loading.set(false);
		}
	},

	/**
	 * Filter performers by skill category (client-side helper)
	 */
	getPerformersBySkill(skill: PerformerSkillCategory): Performer[] {
		return get(_performers).filter((performer) =>
			performer.skills.some((s) => s.category === skill)
		);
	},

	/**
	 * Clear selected performer
	 */
	clearSelectedPerformer() {
		_selectedPerformer.set(null);
	},

	/**
	 * Clear error state
	 */
	clearError() {
		_error.set(null);
	}
};

/**
 * Helper function for filtering performers by skill (standalone)
 */
export function getPerformersBySkill(
	allPerformers: Performer[],
	skill: PerformerSkillCategory
): Performer[] {
	return allPerformers.filter((performer) => performer.skills.some((s) => s.category === skill));
}
