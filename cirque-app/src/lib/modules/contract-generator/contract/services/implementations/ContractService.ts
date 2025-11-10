/**
 * Contract Service Implementation
 * Pure business logic for contract operations
 */

import type { IContractService } from '../contracts/IContractService';
import type { Contract } from '../../domain';
import { DEFAULT_CONTRACT } from '../../domain';

export class ContractService implements IContractService {
	createDefault(): Contract {
		return this.clone(DEFAULT_CONTRACT);
	}

	clone(contract: Contract): Contract {
		return JSON.parse(JSON.stringify(contract));
	}

	toJSON(contract: Contract): string {
		return JSON.stringify(contract, null, 2);
	}

	fromJSON(json: string): Contract {
		try {
			const data = JSON.parse(json);
			return this.validateAndNormalize(data);
		} catch (error) {
			throw new Error(`Failed to parse contract JSON: ${error}`);
		}
	}

	validate(contract: Contract): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		// Validate required fields
		if (!contract.title?.trim()) {
			errors.push('Contract title is required');
		}
		if (!contract.performer_name?.trim()) {
			errors.push('Performer name is required');
		}

		// Validate nested objects
		if (!contract.client) {
			errors.push('Client information is required');
		}
		if (!contract.producer) {
			errors.push('Producer information is required');
		}
		if (!contract.fees) {
			errors.push('Fees information is required');
		}

		// Validate fees
		if (contract.fees?.total_fee < 0) {
			errors.push('Total fee cannot be negative');
		}
		if (contract.fees?.requires_deposit && contract.fees?.deposit_amount < 0) {
			errors.push('Deposit amount cannot be negative');
		}

		return {
			valid: errors.length === 0,
			errors
		};
	}

	getSummary(contract: Contract) {
		return {
			clientName: contract.client?.name || 'Unknown',
			producerName: contract.producer?.name || 'Unknown',
			eventDate: contract.event?.date || 'TBD',
			totalFee: contract.fees?.total_fee || 0
		};
	}

	private validateAndNormalize(data: any): Contract {
		// Ensure all required fields exist with defaults
		return {
			title: data.title || '',
			subtitle: data.subtitle || '',
			effective_date: data.effective_date || new Date().toLocaleDateString(),
			performer_name: data.performer_name || '',
			client: data.client || {},
			producer: data.producer || {},
			event: data.event || {},
			fees: data.fees || {},
			services: data.services || {},
			cancellation: data.cancellation || {},
			schedule: data.schedule || {},
			obligations: data.obligations || {},
			safety: data.safety || {}
		};
	}
}
