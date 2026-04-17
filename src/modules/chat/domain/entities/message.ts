// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	Index
} from 'typeorm';
import { Conversation } from './conversation';
import { Role } from '../../../../shared/domain/enums/role';

@Entity()
export class ConversationMessage {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'text', enum: Role })
	role!: Role;

	@Column('text')
	content!: string;

	@Column({ type: 'boolean', default: false })
	isSummarized!: boolean;

	@CreateDateColumn()
	createdAt!: Date;

	@Index()
	@ManyToOne(() => Conversation, (conversation) => conversation.messages, {
		onDelete: 'CASCADE'
	})
	conversation!: Conversation;

	public archive(): void {
		this.isSummarized = true;
	}
}

