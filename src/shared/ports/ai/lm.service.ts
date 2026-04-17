// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Readable } from 'stream';

import { ChatMessage } from '../../../modules/chat/domain/services/interfaces/chat-message';
import { ConversationMessage } from '../../../modules/chat/domain/entities/message';
import { LMRequest } from '../../../modules/chat/domain/services/interfaces/lm-request';
import { LMConfig } from '../../../infrastructure/ai/rag/rag-config';

export interface LMService {
	chat(messages: ChatMessage[], abortSignal: AbortSignal): Promise<Readable>;

	send(url: string, payload: LMRequest, config?: LMConfig): Promise<string>;

	nonStreamChat(messages: ChatMessage[], abortSignal?: AbortSignal): Promise<string>;

	convertToLLMFormat(conversationMessage: ConversationMessage[]): ChatMessage[];
}

