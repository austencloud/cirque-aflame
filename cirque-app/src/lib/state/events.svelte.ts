// src/lib/state/events.svelte.ts
// Modern Svelte 5 implementation using runes
import type { Event, Performer, EventStatus } from '../types';
import { db_service } from '../services/database';

/**
 * Helper function to get performer details for an event
 */
async function getPerformersWithDetails(event: Event): Promise<Performer[]> {
	const performerIds = event.performers.map((p) => p.performer);
	if (performerIds.length === 0) {
		return [];
	}

	try {
		// Fetch all needed performers
		const performerPromises = performerIds.map(async (id) => {
			try {
				return await db_service.performer.get(id);
			} catch (error) {
				console.error(`Error fetching performer ${id}:`, error);
				return null;
			}
		});

		const fetchedPerformers = (await Promise.all(performerPromises)).filter(
			(p): p is Performer => p !== null
		);

		// Return performers in the order they appear in the event
		return performerIds
			.map((id) => fetchedPerformers.find((p) => p.id === id))
			.filter((p): p is Performer => p !== undefined);
	} catch (error) {
		console.error('Error loading performers:', error);
		return [];
	}
}

// Module-level reactive state
let _events = $state<Event[]>([]);
let _selectedEvent = $state<Event | null>(null);
let _eventPerformers = $state<Performer[]>([]);
let _loading = $state(false);
let _error = $state<string | null>(null);

/**
 * Events Manager - Svelte 5 Runes Implementation
 * Manages events with full CRUD operations and related performer data
 */
export const events = {
	/**
	 * Get all events
	 */
	get events(): Event[] {
		return _events;
	},

	/**
	 * Get the currently selected event
	 */
	get selectedEvent(): Event | null {
		return _selectedEvent;
	},

	/**
	 * Get performers for the selected event
	 */
	get eventPerformers(): Performer[] {
		return _eventPerformers;
	},

	/**
	 * Get loading state
	 */
	get loading(): boolean {
		return _loading;
	},

	/**
	 * Get error state
	 */
	get error(): string | null {
		return _error;
	},

	/**
	 * Load all events from database
	 */
	async loadEvents() {
		_loading = true;
		_error = null;

		try {
			_events = await db_service.event.getAll();
		} catch (error) {
			console.error('Error loading events:', error);
			_error = 'Failed to load events';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load a single event by ID with its performers
	 */
	async loadEvent(id: string) {
		_loading = true;
		_error = null;
		_selectedEvent = null;
		_eventPerformers = [];

		try {
			const event = await db_service.event.get(id);
			if (!event) {
				throw new Error('Event not found');
			}

			// Fetch performers associated with this event
			const performers = await getPerformersWithDetails(event);

			_selectedEvent = event;
			_eventPerformers = performers;
		} catch (error) {
			console.error(`Error loading event ${id}:`, error);
			_error = 'Failed to load event';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load performers for a specific event
	 */
	async loadPerformersForEvent(eventId: string) {
		_loading = true;
		_error = null;

		try {
			let currentEvent = _selectedEvent;

			// Fetch event if not already loaded or if different event
			if (!currentEvent || currentEvent.id !== eventId) {
				currentEvent = await db_service.event.get(eventId);
				if (!currentEvent) {
					throw new Error('Event not found for performer loading');
				}
			}

			const performers = await getPerformersWithDetails(currentEvent);
			_eventPerformers = performers;
		} catch (error) {
			console.error(`Error loading performers for event ${eventId}:`, error);
			_error = 'Failed to load event performers';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Add a new event
	 */
	async addEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		_loading = true;
		_error = null;

		try {
			const id = await db_service.event.add(event);
			const newEvent = await db_service.event.get(id);

			if (newEvent) {
				_events = [..._events, newEvent];
				_selectedEvent = newEvent;
				_eventPerformers = [];

				// Load performers for the new event
				await this.loadPerformersForEvent(newEvent.id);
			}

			return id;
		} catch (error) {
			console.error('Error adding event:', error);
			_error = 'Failed to add event';
			throw error;
		} finally {
			_loading = false;
		}
	},

	/**
	 * Update an existing event
	 */
	async updateEvent(id: string, updates: Partial<Event>) {
		_loading = true;
		_error = null;

		try {
			await db_service.event.update(id, updates);
			const updatedEvent = await db_service.event.get(id);

			if (updatedEvent) {
				// Load performers if the event exists
				const performers = await getPerformersWithDetails(updatedEvent);

				// Update in events array
				const index = _events.findIndex((e) => e.id === id);
				if (index !== -1) {
					_events[index] = updatedEvent;
				}

				// Update selected event and performers if it's the same event
				if (_selectedEvent?.id === id) {
					_selectedEvent = updatedEvent;
					_eventPerformers = performers;
				}
			}
		} catch (error) {
			console.error(`Error updating event ${id}:`, error);
			_error = 'Failed to update event';
			throw error;
		} finally {
			_loading = false;
		}
	},

	/**
	 * Delete an event
	 */
	async deleteEvent(id: string) {
		_loading = true;
		_error = null;

		try {
			await db_service.event.delete(id);

			_events = _events.filter((e) => e.id !== id);

			if (_selectedEvent?.id === id) {
				_selectedEvent = null;
				_eventPerformers = [];
			}
		} catch (error) {
			console.error(`Error deleting event ${id}:`, error);
			_error = 'Failed to delete event';
			throw error;
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load upcoming events
	 */
	async loadUpcomingEvents(limit: number = 10) {
		_loading = true;
		_error = null;

		try {
			_events = await db_service.event.getUpcoming(limit);
		} catch (error) {
			console.error('Error loading upcoming events:', error);
			_error = 'Failed to load upcoming events';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load events by status
	 */
	async loadEventsByStatus(status: EventStatus) {
		_loading = true;
		_error = null;

		try {
			_events = await db_service.event.getByStatus(status);
		} catch (error) {
			console.error(`Error loading events with status ${status}:`, error);
			_error = `Failed to load ${status} events`;
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load events for a specific client
	 */
	async loadClientEvents(clientId: string) {
		_loading = true;
		_error = null;

		try {
			_events = await db_service.event.getByClient(clientId);
		} catch (error) {
			console.error(`Error loading events for client ${clientId}:`, error);
			_error = 'Failed to load client events';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load events for a specific performer
	 */
	async loadPerformerEvents(performerId: string) {
		_loading = true;
		_error = null;

		try {
			_events = await db_service.event.getByPerformer(performerId);
		} catch (error) {
			console.error(`Error loading events for performer ${performerId}:`, error);
			_error = 'Failed to load performer events';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Clear selected event and performers
	 */
	clearSelectedEvent() {
		_selectedEvent = null;
		_eventPerformers = [];
	},

	/**
	 * Clear error state
	 */
	clearError() {
		_error = null;
	}
};
