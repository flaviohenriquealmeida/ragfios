// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ConversationMessage } from './message';
import { ConversationSummary } from './summary';
import { Role } from '../../../../shared/domain/enums/role';
import { ContextSnapShot } from './interfaces/context-snapshot';

@Entity()
export class Conversation {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true, type: 'varchar', length: 32 })
	uuid!: string;

	@Column({ nullable: true, type: 'varchar', length: 50 })
	title?: string;

	@CreateDateColumn()
	createdAt!: Date;

	@OneToMany(() => ConversationMessage, (message) => message.conversation, {
		cascade: true // optional: saves messages automatically when saving conversation
	})
	messages!: ConversationMessage[];

	// One conversation → many messages
	@OneToMany(() => ConversationSummary, (summary) => summary.conversation, {
		cascade: true // optional: saves messages automatically when saving conversation
	})
	summaries!: ConversationSummary[];

	getActiveMessages(): ConversationMessage[] {
		return this.messages.filter((m) => !m.isSummarized);
	}

	isSummarizationNeeded(param: { maxHistory: number }): boolean {
		return this.getActiveMessages().length >= param.maxHistory;
	}

	hasSummary(): boolean {
		return !!this.summaries && this.summaries.length > 0;
	}

	setTitle(query: string): void {
		this.title = query.slice(0, 50);
	}

	setFirstAndLastMessagesId(summary: ConversationSummary): void {
		const activeMessages = this.getActiveMessages();
		summary.fromMessageId = activeMessages[0].id;
		summary.toMessageId = activeMessages[activeMessages.length - 1].id;
	}

	archiveActiveMessages(): void {
		this.getActiveMessages().forEach((m) => m.archive());
	}

	getLatestSummaryText(): string | null {
		if (this.hasSummary()) {
			return this.summaries[this.summaries.length - 1].summary;
		}
		return null;
	}

	getContextSnapshot(): ContextSnapShot {
		return {
			summary: this.hasSummary() ? this.getLatestSummaryText()! : '',
			recentMessages: this.getActiveMessages()
		};
	}

	addSummary(summary: ConversationSummary): void {
		if (!this.summaries) {
			this.summaries = [];
		}
		this.summaries.push(summary);
	}

	addMessage(message: ConversationMessage): void {
		message.conversation = this;
		if (!this.messages) {
			this.messages = [];
		}
		this.messages.push(message);
	}

	archiveHistory(summaryText: string): void {
		const summary = new ConversationSummary();
		summary.conversation = this;
		summary.summary = summaryText;
		this.setFirstAndLastMessagesId(summary);
		this.addSummary(summary);
		this.archiveActiveMessages();
	}

	static createMessageFrom(role: Role, content: string): ConversationMessage {
		const message = new ConversationMessage();
		message.role = role;
		message.content = content;
		return message;
	}

	static createConversationFrom(params: { title: string; uuid: string }): Conversation {
		const conversation = new Conversation();
		conversation.uuid = params.uuid;
		conversation.setTitle(params.title);
		conversation.messages = [];
		conversation.summaries = [];
		return conversation;
	}
}

