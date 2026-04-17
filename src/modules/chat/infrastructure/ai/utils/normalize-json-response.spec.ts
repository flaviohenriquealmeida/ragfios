import { describe, it, expect } from 'vitest';
import { normalizeJsonResponse } from './normalize-json-response';

describe('normalizeJsonResponse', () => {
	it('should remove a trailing comma from a single-item array', () => {
		const input = '[{"id": 1, "relevanceScore": 9},]';
		const expected = '[{"id": 1, "relevanceScore": 9}]';
		expect(normalizeJsonResponse(input)).toBe(expected);
	});

	it('should remove a trailing comma from a multi-item array', () => {
		const input = '[{"id": 1, "relevanceScore": 9}, {"id": 2, "relevanceScore": 3},]';
		const expected = '[{"id": 1, "relevanceScore": 9}, {"id": 2, "relevanceScore": 3}]';
		expect(normalizeJsonResponse(input)).toBe(expected);
	});

	it('should remove trailing commas inside objects', () => {
		const input = '[{"id": 1, "relevanceScore": 9,}]';
		const expected = '[{"id": 1, "relevanceScore": 9}]';
		expect(normalizeJsonResponse(input)).toBe(expected);
	});

	it('should handle extra whitespace and newlines by producing parseable JSON', () => {
		const input = `
      [
        {"id": 1, "relevanceScore": 10},
      ]
    `;
		const result = normalizeJsonResponse(input);

		// Don't test the string content, test the result of the parse
		const parsed = JSON.parse(result);

		expect(parsed).toBeInstanceOf(Array);
		expect(parsed[0].id).toBe(1);
		expect(parsed[0].relevanceScore).toBe(10);
	});

	it('should not mutate valid JSON', () => {
		const input = '[{"id": 1, "relevanceScore": 5}]';
		expect(normalizeJsonResponse(input)).toBe(input);
	});

	it('should handle empty arrays with internal spaces', () => {
		const input = '[ ]';
		const result = normalizeJsonResponse(input);

		// If it parses as an empty array, it's a pass
		expect(JSON.parse(result)).toEqual([]);
	});
});

