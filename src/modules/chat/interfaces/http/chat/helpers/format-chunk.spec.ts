// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { formatChunk } from './format-chunk'; // adjust path

describe(formatChunk.name, () => {
	it('should serialize object to JSON with newline', () => {
		const input = { type: 'text', delta: 'Hello' };

		const result = formatChunk(input);

		expect(result).toBe('{"type":"text","delta":"Hello"}\n');
	});

	it('should handle empty object', () => {
		const result = formatChunk({});

		expect(result).toBe('{}\n');
	});

	it('should handle string input', () => {
		const result = formatChunk('hello');

		expect(result).toBe('"hello"\n');
	});

	it('should handle number input', () => {
		const result = formatChunk(123);

		expect(result).toBe('123\n');
	});

	it('should handle null input', () => {
		const result = formatChunk(null);

		expect(result).toBe('null\n');
	});

	it('should always end with a newline character', () => {
		const result = formatChunk({ foo: 'bar' });

		expect(result.endsWith('\n')).toBe(true);
	});
});

