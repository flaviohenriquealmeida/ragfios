// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Readable } from 'stream';

import { ChatMessage } from '../../../../modules/chat/domain/services/interfaces/chat-message';
import { LMResponse } from '../../../../modules/chat/domain/services/interfaces/lm-response';
import { LMRequest } from '../../../../modules/chat/domain/services/interfaces/lm-request';
import { LMService } from '../../../ports/ai/lm.service';
import { ConversationMessage } from '../../../../modules/chat/domain/entities/message';
import { LMConfig, RAGConfig } from '../../../../infrastructure/ai/rag/rag-config';
import { MyLogger } from '../../../ports/my-logger/my-logger';

export class LMServiceImpl implements LMService {
	constructor(
		private readonly config: RAGConfig,
		private readonly logger: MyLogger
	) {}

	public async send(url: string, payload: LMRequest, config?: LMConfig): Promise<string> {
		const response = await axios.post<LMResponse>(
			url,
			payload,
			config as AxiosRequestConfig<unknown>
		);
		return response.data.choices[0].message.content?.trim();
	}

	public async chat(messages: ChatMessage[], abortSignal: AbortSignal): Promise<Readable> {
		const payload: LMRequest = {
			model: this.config.lm.chat.model,
			messages,
			temperature: this.config.lm.chat.temperature,
			stream: true
		};

		const response = await this.callLM(this.config.lm.chat.url, payload, {
			responseType: 'stream',
			signal: abortSignal
		});

		return response.data as unknown as Readable;
	}

	// TODO CHANGE NAME
	public async nonStreamChat(
		messages: ChatMessage[],
		abortSignal?: AbortSignal
	): Promise<string> {
		const payload: LMRequest = {
			model: this.config.lm.chat.model,
			messages,
			temperature: this.config.lm.chat.temperature,
			stream: false
		};
		const response = await this.callLM(this.config.lm.chat.url, payload, {
			signal: abortSignal
		});

		return response.data.choices[0].message.content;
	}

	public convertToLLMFormat(conversationMessage: ConversationMessage[]): ChatMessage[] {
		return conversationMessage.map((m) => ({
			role: m.role,
			content: this.normalize(m.content)
		}));
	}

	private async callLM(
		url: string,
		payload: LMRequest,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<LMResponse, unknown, object>> {
		return await axios.post<LMResponse>(url, payload, config);
	}

	private normalize(content: string): string {
		return content.trim().replace(/\s+/g, ' ');
	}
}

