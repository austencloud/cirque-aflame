import { describe, it, expect } from 'vitest';
import { ValidationService } from './ValidationService';
import { DEFAULT_CONTRACT, DEFAULT_CLIENT, DEFAULT_FEES } from '../../domain';

describe('ValidationService', () => {
	const service = new ValidationService();

	it('should validate email', () => {
		expect(service.isValidEmail('test@example.com')).toBe(true);
		expect(service.isValidEmail('invalid-email')).toBe(false);
		expect(service.isValidEmail('')).toBe(false);
	});

	it('should validate phone', () => {
		expect(service.isValidPhone('123-456-7890')).toBe(true);
		expect(service.isValidPhone('1234567890')).toBe(true);
		expect(service.isValidPhone('invalid')).toBe(false);
	});

	it('should validate date', () => {
		expect(service.isValidDate('2025-12-31')).toBe(true);
		expect(service.isValidDate('invalid-date')).toBe(false);
	});

	it('should validate client', () => {
		const result = service.validateClient(DEFAULT_CLIENT);
		expect(result).toBeDefined();
		expect(result.valid).toBe(typeof result.valid === 'boolean');
	});

	it('should validate fees', () => {
		const result = service.validateFees(DEFAULT_FEES);
		expect(result).toBeDefined();
		expect(result.valid).toBe(typeof result.valid === 'boolean');
	});

	it('should validate contract', () => {
		const result = service.validateContract(DEFAULT_CONTRACT);
		expect(result).toBeDefined();
		expect(result.valid).toBe(typeof result.valid === 'boolean');
		expect(Array.isArray(result.errors)).toBe(true);
	});
});
