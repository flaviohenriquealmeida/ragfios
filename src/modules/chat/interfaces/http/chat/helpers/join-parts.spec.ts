// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { joinParts } from './join-parts';

describe(joinParts.name, () => {
	it('should join multiple parts with newline', () => {
		const result = joinParts('a', 'b', 'c');

		expect(result).toBe('a\nb\nc');
	});

	it('should filter out empty strings', () => {
		const result = joinParts('a', '', 'b');

		expect(result).toBe('a\nb');
	});

	it('should filter out null values (runtime safety)', () => {
		const result = joinParts('a', null as unknown as string, 'b');

		expect(result).toBe('a\nb');
	});

	it('should filter out undefined values (runtime safety)', () => {
		const result = joinParts('a', undefined as unknown as string, 'b');

		expect(result).toBe('a\nb');
	});

	it('should return empty string when all parts are empty', () => {
		const result = joinParts('', '', '');

		expect(result).toBe('');
	});

	it('should return empty string when no arguments are provided', () => {
		const result = joinParts();

		expect(result).toBe('');
	});

	it('should handle single value', () => {
		const result = joinParts('only');

		expect(result).toBe('only');
	});

	it('should preserve whitespace strings', () => {
		const result = joinParts('a', '   ', 'b');

		expect(result).toBe('a\n   \nb');
	});
});

