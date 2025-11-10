/**
 * Validation Service Interface
 * Defines validation operations for contract data
 */

import type { Contract, Fees, Client, Producer } from '../../domain';

export interface ValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
}

export interface IValidationService {
	/**
	 * Validate entire contract
	 */
	validateContract(contract: Contract | null | undefined): ValidationResult;

	/**
	 * Validate client information
	 */
	validateClient(client: Client): ValidationResult;

	/**
	 * Validate producer information
	 */
	validateProducer(producer: Producer): ValidationResult;

	/**
	 * Validate fees
	 */
	validateFees(fees: Fees): ValidationResult;

	/**
	 * Validate email format
	 */
	isValidEmail(email: string): boolean;

	/**
	 * Validate phone format
	 */
	isValidPhone(phone: string): boolean;

	/**
	 * Validate date format
	 */
	isValidDate(date: string): boolean;
}
