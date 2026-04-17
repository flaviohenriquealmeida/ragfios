// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Conversation } from '../../../domain/entities/conversation';
import { ConversationRepository } from '../../../domain/repositories/conversation.repository';
import { ConversationService } from '../../../domain/services/conversation.service';

export class ConversationImplService implements ConversationService {
	constructor(private readonly repository: ConversationRepository) {}

	public async getConversation(conversationId: string): Promise<Conversation | null> {
		return await this.repository.findByUUID(conversationId);
	}

	public async saveConversation(conversation: Conversation): Promise<Conversation> {
		return this.repository.save(conversation);
	}

	public async findOrCreateConversation(params: {
		conversationId: string;
		newConversationTitle: string;
	}): Promise<Conversation> {
		let conversation = await this.getConversation(params.conversationId);
		if (!conversation) {
			// TODO: better conversation title
			conversation = Conversation.createConversationFrom({
				title: params.newConversationTitle.slice(0, 10),
				uuid: params.conversationId
			});
		}
		return conversation;
	}
}

