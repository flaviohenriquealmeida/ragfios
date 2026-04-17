// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { RAGConfig } from '../../../../../infrastructure/ai/rag/rag-config';
import { Role } from '../../../../../shared/domain/enums/role';
import { LMService } from '../../../../../shared/ports/ai/lm.service';
import { ChatMessage } from '../../../domain/services/interfaces/chat-message';
import { ClassificationResult } from '../../../domain/services/interfaces/classification-result';
import { LMRequest } from '../../../domain/services/interfaces/lm-request';
import { IntentSafetyGuardResult } from '../../../domain/services/interfaces/intent-safety-guard-result';
import { createMessage } from '../utils/create-message';
import { MyLogger } from '../../../../../shared/ports/my-logger/my-logger';
import { IntentClassifierService } from '../../../domain/services/Intent-classifier-service';

export class IntentClassifierImplSevice implements IntentClassifierService {
	constructor(
		private readonly config: RAGConfig,
		private readonly lmService: LMService,
		private readonly logger: MyLogger
	) {}

	public async getPromptClassification(userPrompt: string): Promise<ClassificationResult> {
		const classificationLMConfig = this.config.lm.classification;
		const messages: ChatMessage[] = [
			{
				role: classificationLMConfig.system.role as Role,
				content: classificationLMConfig.system.prompt.template
			},
			{
				role: Role.USER,
				content: `
                        User input:
                        ${userPrompt}
                    `
			}
		];
		const payload: LMRequest = {
			model: classificationLMConfig.model,
			messages,
			temperature: 0,
			stream: false
		};
		const result = await this.lmService.send(classificationLMConfig.url, payload);
		let classificationResult: ClassificationResult;
		try {
			classificationResult = JSON.parse(this.extractJSON(result)) as ClassificationResult;
		} catch (err) {
			this.logger.error('[lm.service] Error parsing classification response', { err });
			classificationResult = {
				confidence: 0,
				intent: 'chat',
				requires_retrieval: true
			};
		}
		return classificationResult;
	}

	public async doIntentSafetyGuard(userQuery: string): Promise<IntentSafetyGuardResult> {
		const messages: ChatMessage[] = [
			createMessage(
				this.config.lm.prompts.intentSafety.role as Role,
				this.config.lm.prompts.intentSafety.template
			),
			createMessage(Role.USER, userQuery)
		];

		const payload: LMRequest = {
			model: this.config.lm.classification.model,
			messages,
			temperature: 0,
			stream: false
		};

		const result = await this.lmService.send(this.config.lm.classification.url, payload);
		let profanityCheckResult: IntentSafetyGuardResult;
		try {
			profanityCheckResult = JSON.parse(this.extractJSON(result)) as IntentSafetyGuardResult;
		} catch (err) {
			this.logger.error(
				'[lm.service] Error parsing classification response. Assuming toxicity true',
				{ err }
			);
			profanityCheckResult = {
				category: 'ERROR',
				reason: `The system was not able to fullfill your request. Try another time`
			};
		}
		return profanityCheckResult;
	}

	private extractJSON(text: string): string {
		const start = text.indexOf('{');
		const end = text.lastIndexOf('}');

		if (start === -1 || end === -1) {
			throw new Error('lm.service] [extractJSON] No JSON found');
		}
		return text.slice(start, end + 1);
	}
}

