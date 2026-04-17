import { describe, it, expect, beforeEach, vi } from 'vitest';

import * as ratiosModule from './get-ratios.js';
import { buildBudget } from './build-budget.js';

// mock the module
vi.mock('./get-ratios.js');

describe('buildBudget', () => {
	const mockRatios = {
		rag: 0.4,
		history: 0.2,
		system: 0.1,
		user: 0.1,
		output: 0.1,
		buffer: 0.1
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ratiosModule.getRatios).mockReturnValue(mockRatios);
	});

	it('uses default total (4096)', () => {
		const result = buildBudget();

		expect(result.total).toBe(4096);
	});

	it('uses ratios from getRatios', () => {
		const result = buildBudget(1000);

		expect(result.input).toEqual({
			rag: 400,
			history: 200,
			system: 100,
			user: 100
		});

		expect(result.output).toBe(100);
		expect(result.buffer).toBe(100);
	});

	it('calls getRatios once', () => {
		buildBudget(1000);

		expect(ratiosModule.getRatios).toHaveBeenCalledTimes(1);
	});

	it('scales linearly with total', () => {
		const result1 = buildBudget(1000);
		const result2 = buildBudget(2000);

		expect(result2.input.rag).toBe(result1.input.rag * 2);
		expect(result2.output).toBe(result1.output * 2);
	});

	it('handles floating point totals', () => {
		const total = 1234.56;

		const result = buildBudget(total);

		expect(result.input.rag).toBeCloseTo(total * mockRatios.rag);
		expect(result.buffer).toBeCloseTo(total * mockRatios.buffer);
	});
});

