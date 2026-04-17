// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateChatStats } from './generate-chat-stats';

describe(generateChatStats.name, () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-01T00:00:10Z'));
	});

	it('should generate formatted stats string', () => {
		const result = generateChatStats({
			firstTokenTime: 5000,
			requestStartTime: 0,
			startTime: 0,
			fullText: 'hello world'
		});

		expect(result).toContain('Tokens/sec');
		expect(result).toContain('Total tokens:');
		expect(result).toContain('Time to first token:');
		expect(result).toContain('Total latency:');
	});

	it('should calculate TTFT correctly', () => {
		const result = generateChatStats({
			firstTokenTime: 2000,
			requestStartTime: 0,
			startTime: 0,
			fullText: 'test'
		});

		expect(result).toContain('2.00s');
	});

	it('should handle null firstTokenTime', () => {
		const result = generateChatStats({
			firstTokenTime: null,
			requestStartTime: 0,
			startTime: 0,
			fullText: 'test'
		});

		expect(result).toContain('0.00s'); // TTFT should be 0
	});

	it('should calculate total tokens from encoder', () => {
		const result = generateChatStats({
			firstTokenTime: 1000,
			requestStartTime: 0,
			startTime: 0,
			fullText: 'anything'
		});

		expect(result).toContain('**Total tokens:** 1');
	});

	it('should compute tokens per second', () => {
		const result = generateChatStats({
			firstTokenTime: 5000,
			requestStartTime: 0,
			startTime: 0,
			fullText: 'text'
		});

		expect(result).toContain('Tokens/sec');
	});

	it('should return string starting with new lines', () => {
		const result = generateChatStats({
			firstTokenTime: 1000,
			requestStartTime: 0,
			startTime: 0,
			fullText: 'text'
		});

		expect(result.startsWith('\n\n')).toBe(true);
	});
});

