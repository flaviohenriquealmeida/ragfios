// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { ConversationMessage } from './message';
import { Role } from '../../../../shared/domain/enums/role';

describe(ConversationMessage.name, () => {
	it('should archive message', () => {
		const message = new ConversationMessage();
		message.isSummarized = false;

		message.archive();

		expect(message.isSummarized).toBe(true);
	});

	it('should preserve other fields when archiving', () => {
		const message = new ConversationMessage();
		message.role = Role.USER;
		message.content = 'hello';
		message.isSummarized = false;

		message.archive();

		expect(message.role).toBe(Role.USER);
		expect(message.content).toBe('hello');
		expect(message.isSummarized).toBe(true);
	});

	it('should allow setting basic properties', () => {
		const message = new ConversationMessage();

		message.id = 1;
		message.role = Role.USER;
		message.content = 'test';
		message.isSummarized = false;

		expect(message.id).toBe(1);
		expect(message.role).toBe(Role.USER);
		expect(message.content).toBe('test');
		expect(message.isSummarized).toBe(false);
	});
});

