// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Conversation } from './conversation';

@Entity()
export class ConversationSummary {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('text')
	summary!: string;

	@Column()
	fromMessageId!: number;

	@Column()
	toMessageId!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@ManyToOne(() => Conversation, (conversation) => conversation.id, {
		onDelete: 'CASCADE'
	})
	conversation!: Conversation;
}

