// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Repository } from 'typeorm';
import { AppDataSource } from './app-data-source';
import { Conversation } from '../../../domain/entities/conversation';
import { ConversationRepository } from '../../../domain/repositories/conversation.repository';

export class ConversationDAO implements ConversationRepository {
	private readonly repo!: Repository<Conversation>;

	constructor() {
		this.repo = AppDataSource.getRepository(Conversation);
	}

	async findByUUID(uuid: string): Promise<Conversation | null> {
		return this.repo.findOne({
			where: { uuid },
			relations: ['messages', 'summaries'],
			order: {
				messages: {
					createdAt: 'ASC'
				}
			}
		});
	}

	async save(conversation: Conversation): Promise<Conversation> {
		return await this.repo.save(conversation);
	}
}

