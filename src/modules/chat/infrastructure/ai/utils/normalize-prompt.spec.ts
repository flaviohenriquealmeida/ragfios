// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { normalizePrompt } from './normalize-prompt';

describe(normalizePrompt.name, () => {
	it('should remove tabs', () => {
		const input = 'Hello\t\tWorld';
		const result = normalizePrompt(input);

		expect(result).toBe('Hello World');
	});

	it('should normalize multiple spaces into one', () => {
		const input = 'Hello    world';
		const result = normalizePrompt(input);

		expect(result).toBe('Hello world');
	});

	it('should collapse multiple newlines into a single newline', () => {
		const input = 'Line1\n\n\nLine2';
		const result = normalizePrompt(input);

		expect(result).toBe('Line1\nLine2');
	});

	it('should trim leading and trailing whitespace', () => {
		const input = '   Hello world   ';
		const result = normalizePrompt(input);

		expect(result).toBe('Hello world');
	});

	it('should handle mixed whitespace correctly', () => {
		const input = '\tHello   world\n\n\n\tNext line\t';
		const result = normalizePrompt(input);

		expect(result).toBe('Hello world\n Next line');
	});

	it('should preserve single newlines', () => {
		const input = 'Line1\nLine2';
		const result = normalizePrompt(input);

		expect(result).toBe('Line1\nLine2');
	});

	it('should not modify already clean text', () => {
		const input = 'Clean text\nAnother line';
		const result = normalizePrompt(input);

		expect(result).toBe(input);
	});

	it('should handle empty string', () => {
		const result = normalizePrompt('');

		expect(result).toBe('');
	});

	it('should handle only whitespace input', () => {
		const input = '   \t   \n\n   ';
		const result = normalizePrompt(input);

		expect(result).toBe('');
	});
});

