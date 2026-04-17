// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { MyDocument } from '../../../modules/chat/domain/repositories/content.repository';
import { ChatMessage } from '../../../modules/chat/domain/services/interfaces/chat-message';

export interface PromptComposerService {
	compose(params: {
		query: string;
		summary: string | null;
		history: ChatMessage[];
		docs: MyDocument[];
	}): ChatMessage[];
}

