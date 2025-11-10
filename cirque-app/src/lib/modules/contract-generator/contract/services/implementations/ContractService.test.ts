import { describe, it, expect } from 'vitest';
import { ContractService } from './ContractService';
import { DEFAULT_CONTRACT } from '../../domain';

describe('ContractService', () => {
	const service = new ContractService();

	it('should create default contract', () => {
		const contract = service.createDefault();
		expect(contract).toBeDefined();
		expect(contract.title).toBe(DEFAULT_CONTRACT.title);
	});

	it('should clone contract', () => {
		const original = service.createDefault();
		const cloned = service.clone(original);

		expect(cloned).toEqual(original);
		expect(cloned).not.toBe(original);
	});

	it('should serialize to JSON', () => {
		const contract = service.createDefault();
		const json = service.toJSON(contract);

		expect(json).toBeDefined();
		expect(typeof json).toBe('string');

		const parsed = JSON.parse(json);
		expect(parsed.title).toBe(contract.title);
	});

	it('should deserialize from JSON', () => {
		const original = service.createDefault();
		const json = service.toJSON(original);
		const restored = service.fromJSON(json);

		expect(restored).toEqual(original);
	});

	it('should validate contract', () => {
		const contract = service.createDefault();
		const result = service.validate(contract);

		expect(result).toBeDefined();
		expect(result.valid).toBe(typeof result.valid === 'boolean');
	});

	it('should get contract summary', () => {
		const contract = service.createDefault();
		const summary = service.getSummary(contract);

		expect(summary).toBeDefined();
		expect(summary.clientName).toBeDefined();
		expect(summary.producerName).toBeDefined();
		expect(summary.eventDate).toBeDefined();
		expect(summary.totalFee).toBeDefined();
	});
});
