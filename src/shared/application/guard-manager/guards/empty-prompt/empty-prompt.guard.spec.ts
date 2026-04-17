// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { EmptyUserQueryGuard } from './empty-prompt.guard';

describe(EmptyUserQueryGuard.name, () => {
	const guard = new EmptyUserQueryGuard();

	it('should return success for non-empty string', async () => {
		const input = 'Hello world';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toBe(input);
		expect(result.reason).toBeUndefined();
	});

	it('should return failure for empty string', async () => {
		const input = '';
		const result = await guard.run(input);

		expect(result.success).toBe(false);
		expect(result.data).toBe(input);
		expect(result.reason).toBe('Empty user query.');
	});

	it('should return failure for null input', async () => {
		const input = null as unknown as string;
		const result = await guard.run(input);

		expect(result.success).toBe(false);
		expect(result.data).toBe(input);
		expect(result.reason).toBe('Empty user query.');
	});

	it('should return failure for undefined input', async () => {
		const input = undefined as unknown as string;
		const result = await guard.run(input);

		expect(result.success).toBe(false);
		expect(result.data).toBe(input);
		expect(result.reason).toBe('Empty user query.');
	});

	it('should treat whitespace as valid (current behavior)', async () => {
		const input = '   ';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toBe(input);
	});
});

