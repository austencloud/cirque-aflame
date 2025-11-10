/**
 * Contract Service Interface
 * Defines the contract for contract management operations
 */

import type { Contract } from '../../domain';

export interface IContractService {
	/**
	 * Create a new default contract
	 */
	createDefault(): Contract;

	/**
	 * Clone a contract
	 */
	clone(contract: Contract): Contract;

	/**
	 * Convert contract to JSON string
	 */
	toJSON(contract: Contract): string;

	/**
	 * Parse contract from JSON string
	 */
	fromJSON(json: string): Contract;

	/**
	 * Validate contract data
	 */
	validate(contract: Contract): { valid: boolean; errors: string[] };

	/**
	 * Get contract summary
	 */
	getSummary(contract: Contract): {
		clientName: string;
		producerName: string;
		eventDate: string;
		totalFee: number;
	};
}
