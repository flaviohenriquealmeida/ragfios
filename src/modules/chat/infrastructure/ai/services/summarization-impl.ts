// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { RAGConfig } from '../../../../../infrastructure/ai/rag/rag-config';
import { Role } from '../../../../../shared/domain/enums/role';
import { LMService } from '../../../../../shared/ports/ai/lm.service';
import { ChatMessage } from '../../../domain/services/interfaces/chat-message';
import { LMRequest } from '../../../domain/services/interfaces/lm-request';
import { SummarizationService } from '../../../domain/services/summarization.service';

export class SummarizationImplService implements SummarizationService {
	constructor(
		private readonly config: RAGConfig,
		private readonly lmService: LMService
	) {}

	public async createSummarization(messagesToSummarize: ChatMessage[]): Promise<string> {
		const classificationLMConfig = this.config.lm.classification;

		const messagesToSummarizeAsText = messagesToSummarize
			.map((m) => `${m.role}: ${m.content}`)
			.join('\n');
		const messages = [
			{
				role: Role.USER, // most be USER ROLE
				content: this.config.lm.prompts.summarization.template.replace(
					'{{messagesToSummarize}}',
					messagesToSummarizeAsText
				)
			}
		];

		const payload: LMRequest = {
			model: classificationLMConfig.model,
			messages,
			temperature: 0,
			stream: false
		};
		return await this.lmService.send(classificationLMConfig.url, payload);
	}
}

