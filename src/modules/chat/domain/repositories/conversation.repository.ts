// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Conversation } from '../entities/conversation';

export interface ConversationRepository {
	findByUUID(id: string): Promise<Conversation | null>;
	save(conversation: Conversation): Promise<Conversation>;
}

