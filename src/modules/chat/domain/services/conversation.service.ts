// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Conversation } from '../entities/conversation';

export interface ConversationService {
	getConversation(conversationId: string): Promise<Conversation | null>;

	saveConversation(conversation: Conversation): Promise<Conversation>;

	findOrCreateConversation(params: {
		conversationId: string;
		newConversationTitle: string;
	}): Promise<Conversation>;
}

