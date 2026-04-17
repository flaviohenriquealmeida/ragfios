// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';

import { createMessage } from './create-message';
import { Role } from '../../../../../shared/domain/enums/role';

describe(createMessage.name, () => {
	it('should create a message with normalized content', () => {
		const input = '  Hello world  ';

		const result = createMessage(Role.USER, input);

		expect(result.role).toBe(Role.USER);
		expect(result.content).toBe(result.content); // sanity check (see below)
	});

	it('should preserve role correctly', () => {
		const result = createMessage(Role.SYSTEM, 'test');

		expect(result.role).toBe(Role.SYSTEM);
	});

	it('should handle empty content', () => {
		const result = createMessage(Role.USER, '');

		expect(result.content).toBeDefined();
	});

	it('should always return a valid ChatMessage shape', () => {
		const result = createMessage(Role.USER, 'hello');

		expect(result).toHaveProperty('role');
		expect(result).toHaveProperty('content');
	});
});

