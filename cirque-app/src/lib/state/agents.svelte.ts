// src/lib/state/agents.svelte.ts
// Modern Svelte 5 Runes Implementation
import { browser } from '$app/environment';
import type { Agent } from '../types';
import { db_service } from '../services/database';

/**
 * Agents Manager - Svelte 5 Runes Implementation
 * Manages agent/agency data with full CRUD operations
 */
class AgentsManager {
	#agents = $state<Agent[]>([]);
	#selectedAgent = $state<Agent | null>(null);
	#loading = $state(false);
	#error = $state<string | null>(null);

	/**
	 * Get all agents
	 */
	get agents(): Agent[] {
		return this.#agents;
	}

	/**
	 * Get the currently selected agent
	 */
	get selectedAgent(): Agent | null {
		return this.#selectedAgent;
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
	 * Load all agents from database
	 */
	async loadAgents() {
		this.#loading = true;
		this.#error = null;

		try {
			this.#agents = await db_service.agent.getAll();
		} catch (error) {
			console.error('Error loading agents:', error);
			this.#error = 'Failed to load agents';
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Load a single agent by ID
	 */
	async loadAgent(id: string) {
		this.#loading = true;
		this.#error = null;

		try {
			const agent = await db_service.agent.get(id);

			if (!agent) {
				throw new Error('Agent not found');
			}

			this.#selectedAgent = agent;
		} catch (error) {
			console.error(`Error loading agent ${id}:`, error);
			this.#error = 'Failed to load agent';
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Add a new agent
	 */
	async addAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		this.#loading = true;
		this.#error = null;

		try {
			const id = await db_service.agent.add(agent);
			const newAgent = await db_service.agent.get(id);

			if (newAgent) {
				this.#agents = [...this.#agents, newAgent];
				this.#selectedAgent = newAgent;
			}

			return id;
		} catch (error) {
			console.error('Error adding agent:', error);
			this.#error = 'Failed to add agent';
			throw error;
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Update an existing agent
	 */
	async updateAgent(id: string, updates: Partial<Agent>) {
		this.#loading = true;
		this.#error = null;

		try {
			await db_service.agent.update(id, updates);
			const updatedAgent = await db_service.agent.get(id);

			if (updatedAgent) {
				// Update in agents array
				const index = this.#agents.findIndex((a) => a.id === id);
				if (index !== -1) {
					this.#agents[index] = updatedAgent;
				}

				// Update selected if it's the same agent
				if (this.#selectedAgent?.id === id) {
					this.#selectedAgent = updatedAgent;
				}
			}
		} catch (error) {
			console.error(`Error updating agent ${id}:`, error);
			this.#error = 'Failed to update agent';
			throw error;
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Delete an agent
	 */
	async deleteAgent(id: string) {
		this.#loading = true;
		this.#error = null;

		try {
			await db_service.agent.delete(id);

			this.#agents = this.#agents.filter((a) => a.id !== id);

			if (this.#selectedAgent?.id === id) {
				this.#selectedAgent = null;
			}
		} catch (error) {
			console.error(`Error deleting agent ${id}:`, error);
			this.#error = 'Failed to delete agent';
			throw error;
		} finally {
			this.#loading = false;
		}
	}

	/**
	 * Clear selected agent
	 */
	clearSelectedAgent() {
		this.#selectedAgent = null;
	}

	/**
	 * Clear error state
	 */
	clearError() {
		this.#error = null;
	}
}

// Export singleton instance - only create in browser to avoid SSR issues
export const agents = browser ? new AgentsManager() : ({
	agents: [],
	selectedAgent: null,
	loading: false,
	error: null,
	loadAgents: async () => {},
	loadAgent: async () => {},
	addAgent: async () => '',
	updateAgent: async () => {},
	deleteAgent: async () => {},
	clearSelectedAgent: () => {},
	clearError: () => {}
} as unknown as AgentsManager);
