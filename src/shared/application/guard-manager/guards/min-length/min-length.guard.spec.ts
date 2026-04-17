// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { MinLengthGuard } from './min-length.guard';

// TODO, this test already show that I have to move those messages in a translation bundle

const message = 'Search term is too short. Try adding more details.';
describe(MinLengthGuard.name, () => {
	const guard = new MinLengthGuard();

	it('should pass when input length is >= 2', async () => {
		const input = 'hi';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toBe(input);
	});

	it('should fail when input length is less than 2 and not a number', async () => {
		const input = 'a';
		const result = await guard.run(input);

		expect(result.success).toBe(false);
		expect(result.data).toBe(input);
		expect(result.reason).toBe(message);
	});

	it('should pass when input is a single digit number', async () => {
		const input = '5';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toBe(input);
	});

	it('should pass when input is a numeric string', async () => {
		const input = '123';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
	});

	it('should pass when input is a decimal number', async () => {
		const input = '3.14';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
	});

	it('should fail for empty string', async () => {
		const input = '';
		const result = await guard.run(input);

		expect(result.success).toBe(false);
		expect(result.reason).toBe(message);
	});

	it('should fail for whitespace-only string', async () => {
		const input = '   ';
		const result = await guard.run(input);

		expect(result.success).toBe(false);
		expect(result.reason).toBe(message);
	});

	it('should fail for non-numeric single character', async () => {
		const input = 'x';
		const result = await guard.run(input);

		expect(result.success).toBe(false);
	});

	it('should treat numeric string with spaces as valid number', async () => {
		const input = ' 42 ';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
	});
});

