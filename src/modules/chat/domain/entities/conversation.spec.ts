// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Conversation } from './conversation';
import { ConversationMessage } from './message';
import { ConversationSummary } from './summary';
import { Role } from '../../../../shared/domain/enums/role';

describe(Conversation.name, () => {
	let conversation: Conversation;

	const createMessage = (id: number, isSummarized = false): ConversationMessage => {
		const msg = new ConversationMessage();
		msg.id = id;
		msg.isSummarized = isSummarized;
		msg.archive = vi.fn(() => {
			msg.isSummarized = true;
		});
		return msg;
	};

	beforeEach(() => {
		conversation = new Conversation();
		conversation.messages = [];
		conversation.summaries = [];
	});

	it('getActiveMessages should return only non-summarized messages', () => {
		const m1 = createMessage(1, false);
		const m2 = createMessage(2, true);

		conversation.messages = [m1, m2];

		const result = conversation.getActiveMessages();

		expect(result).toEqual([m1]);
	});

	it('isSummarizationNeeded should return true when threshold reached', () => {
		conversation.messages = [createMessage(1), createMessage(2)];

		const result = conversation.isSummarizationNeeded({ maxHistory: 2 });

		expect(result).toBe(true);
	});

	it('hasSummary should detect summaries', () => {
		expect(conversation.hasSummary()).toBe(false);

		conversation.summaries.push(new ConversationSummary());

		expect(conversation.hasSummary()).toBe(true);
	});

	it('setTitle should trim to 50 characters', () => {
		const longTitle = 'a'.repeat(100);

		conversation.setTitle(longTitle);

		expect(conversation.title?.length).toBe(50);
	});

	it('setFirstAndLastMessagesId should set correct ids', () => {
		const m1 = createMessage(1);
		const m2 = createMessage(2);

		conversation.messages = [m1, m2];

		const summary = new ConversationSummary();

		conversation.setFirstAndLastMessagesId(summary);

		expect(summary.fromMessageId).toBe(1);
		expect(summary.toMessageId).toBe(2);
	});

	it('archiveActiveMessages should archive only active messages', () => {
		const m1 = createMessage(1, false);
		const m2 = createMessage(2, true);

		conversation.messages = [m1, m2];

		conversation.archiveActiveMessages();

		expect(m1.archive).toHaveBeenCalled();
		expect(m2.archive).not.toHaveBeenCalled();
	});

	it('getLatestSummaryText should return last summary', () => {
		const s1 = new ConversationSummary();
		s1.summary = 'first';

		const s2 = new ConversationSummary();
		s2.summary = 'last';

		conversation.summaries = [s1, s2];

		expect(conversation.getLatestSummaryText()).toBe('last');
	});

	it('getLatestSummaryText should return null if no summaries', () => {
		expect(conversation.getLatestSummaryText()).toBeNull();
	});

	it('addSummary should initialize array if needed', () => {
		const summary = new ConversationSummary();

		conversation.summaries = undefined as unknown as ConversationSummary[];

		conversation.addSummary(summary);

		expect(conversation.summaries).toContain(summary);
	});

	it('addMessage should assign conversation and push message', () => {
		const message = new ConversationMessage();

		conversation.addMessage(message);

		expect(message.conversation).toBe(conversation);
		expect(conversation.messages).toContain(message);
	});

	it('archiveHistory should create summary and archive messages', () => {
		const m1 = createMessage(1);
		const m2 = createMessage(2);

		conversation.messages = [m1, m2];

		conversation.archiveHistory('summary text');

		expect(conversation.summaries.length).toBe(1);
		expect(conversation.summaries[0].summary).toBe('summary text');

		expect(m1.archive).toHaveBeenCalled();
		expect(m2.archive).toHaveBeenCalled();
	});

	it('createMessageFrom should create message with role and content', () => {
		const message = Conversation.createMessageFrom(Role.USER, 'hello');

		expect(message.role).toBe(Role.USER);
		expect(message.content).toBe('hello');
	});

	it('createConversationFrom should initialize correctly', () => {
		const conversation = Conversation.createConversationFrom({
			title: 'Hello world',
			uuid: '123'
		});

		expect(conversation.uuid).toBe('123');
		expect(conversation.title).toBe('Hello world');
		expect(conversation.messages).toEqual([]);
		expect(conversation.summaries).toEqual([]);
	});
});

