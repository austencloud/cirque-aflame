/**
 * Validation Service Implementation
 * Pure business logic for validation operations
 */

import type { IValidationService, ValidationResult } from '../contracts/IValidationService';
import type { Contract, Fees, Client, Producer } from '../../domain';

export class ValidationService implements IValidationService {
	validateContract(contract: Contract | null | undefined): ValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		// Check if contract exists
		if (!contract) {
			errors.push('Contract is not initialized');
			return { valid: false, errors, warnings };
		}

		// Validate title
		if (!contract.title?.trim()) {
			errors.push('Contract title is required');
		}

		// Validate performer name
		if (!contract.performer_name?.trim()) {
			errors.push('Performer name is required');
		}

		// Validate nested objects
		if (contract.client) {
			const clientValidation = this.validateClient(contract.client);
			if (!clientValidation.valid) {
				errors.push(...clientValidation.errors);
			}
		}

		if (contract.producer) {
			const producerValidation = this.validateProducer(contract.producer);
			if (!producerValidation.valid) {
				errors.push(...producerValidation.errors);
			}
		}

		if (contract.fees) {
			const feesValidation = this.validateFees(contract.fees);
			if (!feesValidation.valid) {
				errors.push(...feesValidation.errors);
			}
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings
		};
	}

	validateClient(client: Client): ValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (client.email && !this.isValidEmail(client.email)) {
			errors.push('Invalid client email format');
		}

		if (client.phone && !this.isValidPhone(client.phone)) {
			warnings.push('Client phone format may be invalid');
		}

		if (!client.name?.trim()) {
			warnings.push('Client name is recommended');
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings
		};
	}

	validateProducer(producer: Producer): ValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (producer.email && !this.isValidEmail(producer.email)) {
			errors.push('Invalid producer email format');
		}

		if (producer.phone && !this.isValidPhone(producer.phone)) {
			warnings.push('Producer phone format may be invalid');
		}

		if (!producer.name?.trim()) {
			warnings.push('Producer name is recommended');
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings
		};
	}

	validateFees(fees: Fees): ValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (fees.total_fee < 0) {
			errors.push('Total fee cannot be negative');
		}

		if (fees.total_fee === 0) {
			warnings.push('Total fee is zero');
		}

		if (fees.requires_deposit && fees.deposit_amount < 0) {
			errors.push('Deposit amount cannot be negative');
		}

		if (fees.requires_deposit && fees.deposit_amount > fees.total_fee) {
			errors.push('Deposit amount cannot exceed total fee');
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings
		};
	}

	isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	isValidPhone(phone: string): boolean {
		// Simple phone validation - at least 10 digits
		const phoneRegex = /\d{10,}/;
		return phoneRegex.test(phone.replace(/\D/g, ''));
	}

	isValidDate(date: string): boolean {
		const dateObj = new Date(date);
		return dateObj instanceof Date && !isNaN(dateObj.getTime());
	}
}
