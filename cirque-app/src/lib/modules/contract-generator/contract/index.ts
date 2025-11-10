/**
 * Contract Module Barrel Export
 * Exports all public APIs from the contract module
 */

// Domain
export type {
	Client,
	Producer,
	Event,
	Fees,
	Services,
	Cancellation,
	Schedule,
	Obligations,
	Safety,
	Contract
} from './domain';

export {
	DEFAULT_CLIENT,
	DEFAULT_PRODUCER,
	DEFAULT_EVENT,
	DEFAULT_FEES,
	DEFAULT_SERVICES,
	DEFAULT_CANCELLATION,
	DEFAULT_SCHEDULE,
	DEFAULT_OBLIGATIONS,
	DEFAULT_SAFETY,
	DEFAULT_CONTRACT,
	DEPOSIT_PERCENTAGE
} from './domain';

// Services
export type { IContractService, IValidationService, ValidationResult } from './services';
export { ContractService, ValidationService } from './services';

// State
export { createContractState } from './state';
export type { ContractState } from './state';

// Components
export { ContractEditor } from './components';
export * from './components/forms';
