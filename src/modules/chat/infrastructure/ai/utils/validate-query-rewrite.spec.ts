// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { cosineSimilarity, validateQueryRewrite } from './validate-query-rewrite';

describe(cosineSimilarity.name, () => {
	it('should return 1 for identical vectors', () => {
		const v = [1, 2, 3];

		const result = cosineSimilarity(v, v);

		expect(result).toBeCloseTo(1);
	});

	it('should return 0 for orthogonal vectors', () => {
		const v1 = [1, 0];
		const v2 = [0, 1];

		const result = cosineSimilarity(v1, v2);

		expect(result).toBeCloseTo(0);
	});

	it('should return -1 for opposite vectors', () => {
		const v1 = [1, 0];
		const v2 = [-1, 0];

		const result = cosineSimilarity(v1, v2);

		expect(result).toBeCloseTo(-1);
	});

	it('should compute correct similarity for arbitrary vectors', () => {
		const v1 = [1, 2, 3];
		const v2 = [4, 5, 6];

		const result = cosineSimilarity(v1, v2);

		expect(result).toBeCloseTo(0.9746, 4);
	});

	it('should handle decimal vectors', () => {
		const v1 = [0.1, 0.2];
		const v2 = [0.1, 0.2];

		const result = cosineSimilarity(v1, v2);

		expect(result).toBeCloseTo(1);
	});
});

describe(validateQueryRewrite.name, () => {
	it('should return valid when similarity >= 0.75', () => {
		const result = validateQueryRewrite({
			embOriginalUserQuery: [1, 0],
			embRewrittenUserQuery: [0.8, 0.2]
		});

		expect(result.valid).toBe(true);
		expect(result.similarity).toBeGreaterThanOrEqual(0.75);
		expect(result.reason).toBeUndefined();
	});

	it('should return invalid when similarity < 0.75', () => {
		const result = validateQueryRewrite({
			embOriginalUserQuery: [1, 0],
			embRewrittenUserQuery: [0, 1]
		});

		expect(result.valid).toBe(false);
		expect(result.reason).toBe('semantic drift');
		expect(result.similarity).toBeLessThan(0.75);
	});

	it('should handle identical embeddings as valid', () => {
		const v = [0.3, 0.4, 0.5];

		const result = validateQueryRewrite({
			embOriginalUserQuery: v,
			embRewrittenUserQuery: v
		});

		expect(result.valid).toBe(true);
		expect(result.similarity).toBeCloseTo(1);
	});

	it('should detect borderline threshold correctly', () => {
		const result = validateQueryRewrite({
			embOriginalUserQuery: [1, 0],
			embRewrittenUserQuery: [0.75, Math.sqrt(1 - 0.75 ** 2)]
		});

		expect(result.similarity).toBeCloseTo(0.75, 2);
		expect(result.valid).toBe(true);
	});
});

