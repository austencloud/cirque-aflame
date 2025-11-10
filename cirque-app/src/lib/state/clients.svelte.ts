// src/lib/state/clients.svelte.ts
// Modern Svelte 5 implementation using runes
import type { Client, ClientStatus } from '../types';
import { db_service } from '../services/database';
import { browser } from '$app/environment';

// Mock data flag
const useMockData = browser && import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock data for development
const MOCK_CLIENTS: Client[] = [
	{
		id: 'mock-client-1',
		name: 'Pritzker Elementary',
		contactPerson: 'Principal Jones',
		email: 'pjones@example.com',
		phone: '555-1111',
		address: '123 School St, Chicago',
		eventTypes: ['School Event', 'Festival'],
		servicesUsed: ['Balloon Art', 'Juggling'],
		lastPerformed: new Date(2023, 8, 15),
		lastContacted: new Date(2024, 6, 5),
		nextFollowUp: { date: new Date(2024, 7, 1), task: 'Confirm details for Back To School Bash' },
		notes: 'Loves the balloon dog act.',
		status: 'active',
		events: ['event1'],
		createdAt: new Date(2023, 1, 1),
		updatedAt: new Date(2024, 6, 5)
	},
	{
		id: 'mock-client-2',
		name: 'Agudath Jacob Synagogue',
		contactPerson: 'Rabbi Cohen',
		email: 'rcohen@example.com',
		phone: '555-2222',
		address: '456 Temple Rd, Chicago',
		eventTypes: ['Holiday Event', 'Religious Event'],
		servicesUsed: ['Fire Performance', 'LED Performance'],
		lastPerformed: new Date(2023, 11, 10),
		lastContacted: new Date(2024, 6, 1),
		nextFollowUp: { date: new Date(2024, 6, 14), task: 'Discuss Hannukah event details' },
		notes: 'Needs fire safety plan approval.',
		status: 'yearly',
		events: [],
		createdAt: new Date(2022, 5, 1),
		updatedAt: new Date(2024, 6, 1)
	},
	{
		id: 'mock-client-3',
		name: 'Schwab Rehab Hospital',
		contactPerson: 'Activity Director',
		email: 'activities@example.com',
		phone: '555-3333',
		address: '789 Health Ave, Chicago',
		eventTypes: ['Corporate Event'],
		servicesUsed: ['Ambient Entertainment', 'Magic'],
		lastPerformed: null,
		lastContacted: new Date(2024, 5, 25),
		nextFollowUp: { date: null, task: '' },
		notes: 'Initial inquiry for Sept 18th event.',
		status: 'lead',
		events: [],
		createdAt: new Date(2024, 5, 25),
		updatedAt: new Date(2024, 5, 25)
	}
];

// Module-level reactive state
let _clients = $state<Client[]>(useMockData ? [...MOCK_CLIENTS] : []);
let _selectedClient = $state<Client | null>(null);
let _loading = $state(!useMockData);
let _error = $state<string | null>(null);
let _mockData = $state<Client[]>([...MOCK_CLIENTS]); // Mutable copy for mock mode

/**
 * Simulate delay for mock operations
 */
const simulateDelay = () => new Promise((res) => setTimeout(res, 300));

/**
 * Clients Manager - Svelte 5 Runes Implementation
 * Manages client data with full CRUD operations and optional mock data support
 */
export const clients = {
	/**
	 * Get all clients
	 */
	get clients(): Client[] {
		return _clients;
	},

	/**
	 * Get the currently selected client
	 */
	get selectedClient(): Client | null {
		return _selectedClient;
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
	 * Load all clients
	 */
	async loadClients() {
		if (useMockData) {
			console.warn('[Mock] loadClients');
			await simulateDelay();
			_clients = [..._mockData];
			_loading = false;
			_error = null;
			return;
		}

		_loading = true;
		_error = null;

		try {
			_clients = await db_service.client.getAll();
		} catch (error) {
			console.error('Error loading clients:', error);
			_error = 'Failed to load clients';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load a single client by ID
	 */
	async loadClient(id: string) {
		if (useMockData) {
			console.warn(`[Mock] loadClient: ${id}`);
			await simulateDelay();
			const client = _mockData.find((c) => c.id === id) || null;

			if (client) {
				_selectedClient = client;
				_error = null;
			} else {
				_selectedClient = null;
				_error = 'Mock client not found';
			}
			_loading = false;
			return;
		}

		_loading = true;
		_error = null;

		try {
			const client = await db_service.client.get(id);
			_selectedClient = client;
			if (!client) {
				_error = 'Client not found';
			}
		} catch (error) {
			console.error(`Error loading client ${id}:`, error);
			_error = 'Failed to load client';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Add a new client
	 */
	async addClient(
		clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<string | null> {
		if (useMockData) {
			console.warn('[Mock] addClient:', clientData.name);
			await simulateDelay();

			const newId = `mock-client-${Date.now()}`;
			const newClient: Client = {
				...clientData,
				id: newId,
				createdAt: new Date(),
				updatedAt: new Date(),
				events: clientData.events || [],
				lastPerformed: clientData.lastPerformed || null,
				lastContacted: clientData.lastContacted || null,
				nextFollowUp: clientData.nextFollowUp || { date: null, task: '' }
			};

			_mockData = [..._mockData, newClient];
			_clients = [..._mockData];
			_selectedClient = newClient;
			_loading = false;

			return newId;
		}

		_loading = true;
		_error = null;

		try {
			const id = await db_service.client.add(clientData);
			const newClient = await db_service.client.get(id);

			if (newClient) {
				_clients = [..._clients, newClient];
				_selectedClient = newClient;
				return id;
			} else {
				throw new Error('Failed to fetch newly added client');
			}
		} catch (error) {
			console.error('Error adding client:', error);
			_error = 'Failed to add client';
			return null;
		} finally {
			_loading = false;
		}
	},

	/**
	 * Update an existing client
	 */
	async updateClient(id: string, updates: Partial<Client>) {
		if (useMockData) {
			console.warn(`[Mock] updateClient: ${id}`, updates);
			await simulateDelay();

			const index = _mockData.findIndex((c) => c.id === id);

			if (index !== -1) {
				_mockData[index] = {
					..._mockData[index],
					...updates,
					updatedAt: new Date()
				};

				const updatedClient = _mockData[index];
				_clients = [..._mockData];

				if (_selectedClient?.id === id) {
					_selectedClient = updatedClient;
				}
			} else {
				_error = 'Mock client not found for update';
			}
			_loading = false;
			return;
		}

		_loading = true;
		_error = null;

		try {
			await db_service.client.update(id, updates);
			const updatedClient = await db_service.client.get(id);

			if (updatedClient) {
				const index = _clients.findIndex((c) => c.id === id);
				if (index !== -1) {
					_clients[index] = updatedClient;
				}

				if (_selectedClient?.id === id) {
					_selectedClient = updatedClient;
				}
			} else {
				await clients.loadClients();
				_error = 'Client data may be inconsistent after update.';
			}
		} catch (error) {
			console.error(`Error updating client ${id}:`, error);
			_error = 'Failed to update client';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Delete a client
	 */
	async deleteClient(id: string) {
		if (useMockData) {
			console.warn(`[Mock] deleteClient: ${id}`);
			await simulateDelay();

			_mockData = _mockData.filter((c) => c.id !== id);
			_clients = [..._mockData];

			if (_selectedClient?.id === id) {
				_selectedClient = null;
			}

			_loading = false;
			return;
		}

		_loading = true;
		_error = null;

		try {
			await db_service.client.delete(id);

			_clients = _clients.filter((c) => c.id !== id);

			if (_selectedClient?.id === id) {
				_selectedClient = null;
			}
		} catch (error) {
			console.error(`Error deleting client ${id}:`, error);
			_error = 'Failed to delete client';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load clients by status
	 */
	async loadClientsByStatus(status: ClientStatus) {
		if (useMockData) {
			console.warn(`[Mock] loadClientsByStatus: ${status}`);
			await simulateDelay();
			_clients = _mockData.filter((c) => c.status === status);
			_loading = false;
			_error = null;
			return;
		}

		_loading = true;
		_error = null;

		try {
			_clients = await db_service.client.getByStatus(status);
		} catch (error) {
			console.error(`Error loading clients with status ${status}:`, error);
			_error = `Failed to load ${status} clients`;
		} finally {
			_loading = false;
		}
	},

	/**
	 * Load clients needing follow-up within specified days
	 */
	async loadFollowUpClients(days: number = 7) {
		if (useMockData) {
			console.warn('[Mock] loadFollowUpClients');
			await simulateDelay();

			const today = new Date();
			const futureDate = new Date();
			today.setHours(0, 0, 0, 0);
			futureDate.setDate(today.getDate() + days);
			futureDate.setHours(23, 59, 59, 999);

			_clients = _mockData.filter(
				(c) =>
					c.nextFollowUp?.date && c.nextFollowUp.date >= today && c.nextFollowUp.date <= futureDate
			);
			_loading = false;
			_error = null;
			return;
		}

		_loading = true;
		_error = null;

		try {
			_clients = await db_service.client.getForFollowUp(days);
		} catch (error) {
			console.error('Error loading follow-up clients:', error);
			_error = 'Failed to load follow-up clients';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Search clients by term
	 */
	async searchClients(searchTerm: string) {
		if (useMockData) {
			console.warn(`[Mock] searchClients: ${searchTerm}`);
			await simulateDelay();

			if (!searchTerm.trim()) {
				_clients = [..._mockData];
			} else {
				const searchLower = searchTerm.toLowerCase();
				_clients = _mockData.filter(
					(client) =>
						client.name?.toLowerCase().includes(searchLower) ||
						client.contactPerson?.toLowerCase().includes(searchLower) ||
						client.email?.toLowerCase().includes(searchLower)
				);
			}

			_loading = false;
			return;
		}

		_loading = true;
		_error = null;

		try {
			_clients = await db_service.client.search(searchTerm);
		} catch (error) {
			console.error('Error searching clients:', error);
			_error = 'Failed to search clients';
		} finally {
			_loading = false;
		}
	},

	/**
	 * Clear selected client
	 */
	clearSelectedClient() {
		_selectedClient = null;
	},

	/**
	 * Clear error state
	 */
	clearError() {
		_error = null;
	}
};
