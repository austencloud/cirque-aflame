/**
 * Contract State Management
 * Svelte 5 runes for reactive state
 */

import { ContractService, ValidationService } from '../services';
import type { Contract } from '../domain';
import { DEFAULT_CONTRACT, DEPOSIT_PERCENTAGE } from '../domain';

export function createContractState() {
	// Services
	const contractService = new ContractService();
	const validationService = new ValidationService();

	// State
	let contract = $state<Contract>(contractService.createDefault());
	let isDirty = $state(false);
	let validationErrors = $state<string[]>([]);
	let validationWarnings = $state<string[]>([]);

	// Derived state
	const isValid = $derived(() => {
		if (!contract) {
			return false;
		}
		const result = validationService.validateContract(contract);
		return result.valid;
	});

	const summary = $derived(() => {
		if (!contract) {
			return { clientName: '', producerName: '', eventDate: '', totalFee: 0 };
		}
		return contractService.getSummary(contract);
	});

	const depositAmount = $derived(() => {
		if (!contract?.fees) {
			return 0;
		}
		if (contract.fees.requires_deposit) {
			return contract.fees.total_fee * DEPOSIT_PERCENTAGE;
		}
		return 0;
	});

	const balanceAmount = $derived(() => {
		if (!contract?.fees) {
			return 0;
		}
		return contract.fees.total_fee - depositAmount();
	});

	// Methods
	function newContract() {
		contract = contractService.createDefault();
		isDirty = false;
		validationErrors = [];
		validationWarnings = [];
	}

	function loadContract(data: Contract) {
		contract = contractService.clone(data);
		isDirty = false;
		validate();
	}

	function validate() {
		const result = validationService.validateContract(contract);
		validationErrors = result.errors;
		validationWarnings = result.warnings;
		return result.valid;
	}

	function updateContract(updates: Partial<Contract>) {
		contract = { ...contract, ...updates };
		isDirty = true;
		validate();
	}

	function updateFees(updates: Partial<typeof contract.fees>) {
		contract.fees = { ...contract.fees, ...updates };
		// Auto-calculate balance if deposit is enabled
		if (contract.fees.requires_deposit) {
			contract.fees.deposit_amount = contract.fees.total_fee * DEPOSIT_PERCENTAGE;
			contract.fees.balance = contract.fees.total_fee - contract.fees.deposit_amount;
		} else {
			contract.fees.balance = contract.fees.total_fee;
		}
		isDirty = true;
		validate();
	}

	function exportToJSON(): string {
		return contractService.toJSON(contract);
	}

	function importFromJSON(json: string): boolean {
		try {
			const imported = contractService.fromJSON(json);
			loadContract(imported);
			return true;
		} catch (error) {
			console.error('Failed to import contract:', error);
			return false;
		}
	}

	function reset() {
		contract = contractService.createDefault();
		isDirty = false;
		validationErrors = [];
		validationWarnings = [];
	}

	return {
		// State
		get contract() {
			return contract;
		},
		set contract(value: Contract) {
			contract = value;
			isDirty = true;
		},

		get isDirty() {
			return isDirty;
		},

		get validationErrors() {
			return validationErrors;
		},

		get validationWarnings() {
			return validationWarnings;
		},

		// Derived
		get isValid() {
			return isValid();
		},

		get summary() {
			return summary();
		},

		get depositAmount() {
			return depositAmount();
		},

		get balanceAmount() {
			return balanceAmount();
		},

		// Methods
		newContract,
		loadContract,
		validate,
		updateContract,
		updateFees,
		exportToJSON,
		importFromJSON,
		reset
	};
}

export type ContractState = ReturnType<typeof createContractState>;
