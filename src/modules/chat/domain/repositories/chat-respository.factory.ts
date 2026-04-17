// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { ContentRepository } from './content.repository';
import { ConversationRepository } from './conversation.repository';

export interface RepositoryFactory {
	getConversation(): ConversationRepository;
	getContent(): ContentRepository;
}

