// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { DataSource } from 'typeorm';
import { Conversation } from '../../../domain/entities/conversation';
import { ConversationMessage } from '../../../domain/entities/message';
import { ConversationSummary } from '../../../domain/entities/summary';

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: './database/relational/chat.sqlite',
	synchronize: true,
	entities: [Conversation, ConversationMessage, ConversationSummary]
});

