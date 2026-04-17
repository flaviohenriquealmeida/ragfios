// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { RAGConfig } from '../../../../../infrastructure/ai/rag/rag-config';
import { Role } from '../../../../../shared/domain/enums/role';
import { LMService } from '../../../../../shared/ports/ai/lm.service';
import { MyDocument } from '../../../domain/repositories/content.repository';
import { LMRequest } from '../../../domain/services/interfaces/lm-request';
import { RerankedResult } from '../../../domain/services/interfaces/reranked-result';
import { RerankingService } from '../../../domain/services/reranking.service';
import { normalizeJsonResponse } from '../utils/normalize-json-response';

export class RerankingImplService implements RerankingService {
	constructor(
		private readonly lmService: LMService,
		private readonly config: RAGConfig
	) {}
	async rerank(rewrittenQuery: string, retrievedContent: MyDocument[]): Promise<MyDocument[]> {
		const chunks = retrievedContent
			.map((chunk) => {
				// We strip the word "Content" and use "D" (Data)
				return `ID:${chunk.id}|D:"""${chunk.text.replace(/\n/g, ' ').trim()}"""`;
			})
			.join('\n');

		const userContent = this.config.lm.prompts.rerank.user.template
			.replace('{{rewrittenQuery}}', rewrittenQuery)
			.replace('{{chunks}}', chunks)
			.replace('{{chunksLengh}}', retrievedContent.length.toString());

		// SPLIT THE MESSAGES
		const messages = [
			{
				role: Role.SYSTEM,
				content: this.config.lm.prompts.rerank.system.template
			},
			{
				role: Role.USER,
				content: userContent
			}
		];

		const payload: LMRequest = {
			model: this.config.lm.chat.model,
			messages,
			temperature: 0,
			stream: false
		};

		const result = await this.lmService.send(this.config.lm.chat.url, payload);
		const normalizedJson = normalizeJsonResponse(result);
		const scores = JSON.parse(normalizedJson) as RerankedResult[];

		const rerankedChunks = retrievedContent.map((chunk) => {
			// Find the score that matches this chunk's ID
			const scoreEntry = scores.find((s) => s.id === chunk.id);

			return {
				...chunk,
				rerankScore: scoreEntry ? scoreEntry.relevanceScore : 0 // Default to 0 if not found
			};
		});

		return rerankedChunks
			.filter((c) => c.rerankScore >= 4) // Drop irrelevant "noise"
			.sort((a, b) => b.rerankScore - a.rerankScore) // Highest score first
			.slice(0, 5); // Take only the best 5 for the final answer
	}
}

