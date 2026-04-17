import { describe, it, expect, vi, afterEach } from 'vitest';
import { getRatios } from './get-ratios';

describe('getRatios', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns the expected ratios', () => {
		const ratios = getRatios();

		expect(ratios).toEqual({
			rag: 0.45,
			history: 0.15,
			system: 0.05,
			user: 0.05,
			output: 0.2,
			buffer: 0.1
		});
	});

	it('ratios sum to 1 within tolerance', () => {
		const ratios = getRatios();

		const sum = Object.values(ratios).reduce((a, b) => a + b, 0);

		expect(sum).toBeCloseTo(1, 3);
	});

	it('does not throw when ratios are valid', () => {
		expect(() => getRatios()).not.toThrow();
	});

	it('throws if ratios do not sum to 1 (forced scenario)', () => {
		// Force invalid sum by mocking Object.values
		const spy = vi.spyOn(Object, 'values').mockReturnValue([0.5, 0.5, 0.5, 0, 0, 0]); // sum = 1.5

		expect(() => getRatios()).toThrowError('ratios must sum to 1');

		spy.mockRestore();
	});
});

