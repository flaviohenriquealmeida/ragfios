// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';

import { createHistoryItem } from './create-history-item';
import { Role } from '../../../../../shared/domain/enums/role';

describe(createHistoryItem.name, () => {
	it('should format role and text correctly', () => {
		const result = createHistoryItem(Role.USER, 'Hello');

		expect(result).toBe(`${Role.USER}: Hello`);
	});

	it('should work with different roles', () => {
		const result = createHistoryItem(Role.SYSTEM, 'System message');

		expect(result).toBe(`${Role.SYSTEM}: System message`);
	});

	it('should handle empty text', () => {
		const result = createHistoryItem(Role.USER, '');

		expect(result).toBe(`${Role.USER}: `);
	});

	it('should preserve special characters', () => {
		const text = 'Hello\nWorld! 🚀';
		const result = createHistoryItem(Role.USER, text);

		expect(result).toBe(`${Role.USER}: ${text}`);
	});

	it('should handle long text', () => {
		const text = 'a'.repeat(1000);

		const result = createHistoryItem(Role.USER, text);

		expect(result).toBe(`${Role.USER}: ${text}`);
	});
});

