// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { RAGConfig } from '../../../../../infrastructure/ai/rag/rag-config';
import { Role } from '../../../../../shared/domain/enums/role';
import { LMService } from '../../../../../shared/ports/ai/lm.service';
import { Conversation } from '../../../domain/entities/conversation';
import { LMRequest } from '../../../domain/services/interfaces/lm-request';
import { QueryExpansionService } from '../../../domain/services/query-expansion.service';
import { embed } from '../embedder/embedder';
import { createHistoryItem } from '../utils/create-history-item';
import { createMessage } from '../utils/create-message';
import {
	QueryRewriteValidationResult,
	validateQueryRewrite
} from '../utils/validate-query-rewrite';

export class QueryExpansionImplService implements QueryExpansionService {
	constructor(
		private readonly config: RAGConfig,
		private readonly lmSerice: LMService
	) {}
	public async rewriteQuery(userQuery: string, conversation: Conversation): Promise<string> {
		const queryRewriteConfig = this.config.lm.queryRewrite;
		const summary = conversation.hasSummary() ? conversation.getLatestSummaryText() : '';
		const activeMessages = conversation
			.getActiveMessages()
			.map((m) => createHistoryItem(m.role, m.content))
			.join('\n');

		const system = createMessage(
			queryRewriteConfig.system.role as Role,
			queryRewriteConfig.system.prompt.template
		);

		const user = createMessage(
			Role.USER,
			`
[Summary]
${summary}
    
[Recent Turns]
${activeMessages}

[Query]
${userQuery}

Standalone Question:` // Using a colon like this "points" the model toward the answer
		);
		const messages = [system, user];
		console.log(JSON.stringify(messages));
		const payload: LMRequest = {
			model: queryRewriteConfig.model,
			messages: messages,
			temperature: 0,
			stream: false
		};
		return await this.lmSerice.send(queryRewriteConfig.url, payload);
	}

	public async validateQueryRewrite(params: {
		originalUserQuery: string;
		rewrittenUserQuery: string;
	}): Promise<QueryRewriteValidationResult> {
		const [embOriginalUserQuery, embRewrittenUserQuery] = await Promise.all([
			embed(params.originalUserQuery),
			embed(params.rewrittenUserQuery)
		]);

		const result = validateQueryRewrite({ embOriginalUserQuery, embRewrittenUserQuery });
		return result;
	}
}

