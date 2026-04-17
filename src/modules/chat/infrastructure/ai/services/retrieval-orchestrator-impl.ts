// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { GuardManager } from '../../../../../shared/application/guard-manager/guard-manager';
import { GuardEvents } from '../../../../../shared/application/guard-manager/types/guard-events';
import { Content } from '../../../../../shared/domain/enums/content';
import { throwIfAborted } from '../../../../../shared/infrastructure/utils/throw-If-aborted';
import { MyLogger } from '../../../../../shared/ports/my-logger/my-logger';
import { ChatContextMapper } from '../../../application/mappers/chat-context.mapper';
import { Conversation } from '../../../domain/entities/conversation';

import { ContentRepository, MyDocument } from '../../../domain/repositories/content.repository';
import { IntentClassifierService } from '../../../domain/services/Intent-classifier-service';
import { QueryExpansionService } from '../../../domain/services/query-expansion.service';
import { RerankingService } from '../../../domain/services/reranking.service';
import { RetrievalOrchestratorService } from '../../../domain/services/retrieval-orchestrator.service';

export class RetrievalOrchestratorImplService implements RetrievalOrchestratorService {
	constructor(
		private readonly intentClassifierService: IntentClassifierService,
		private readonly queryExpansionService: QueryExpansionService,
		private readonly contentRepository: ContentRepository,
		private readonly rerankService: RerankingService,
		private readonly guardManager: GuardManager,
		private readonly logger: MyLogger
	) {}

	async retrieveContext(
		query: string,
		conversation: Conversation,
		signal: AbortSignal
	): Promise<MyDocument[]> {
		const classification = await this.intentClassifierService.getPromptClassification(query);
		this.logger.info(`[${RetrievalOrchestratorImplService.name}] ClassificationResult:`, {
			classification
		});

		let rerankedDocs: MyDocument[] = [];

		if (classification.requires_retrieval) {
			let rewrittenUserQuery = await this.queryExpansionService.rewriteQuery(
				query,
				conversation
			);

			this.logger.info(RetrievalOrchestratorImplService.name, { rewrittenUserQuery });
			const queryRewriteValidationResult =
				await this.queryExpansionService.validateQueryRewrite({
					originalUserQuery: ChatContextMapper.toMathContext(
						conversation.getContextSnapshot(),
						query
					),
					rewrittenUserQuery
				});

			this.logger.info(
				'Query rewrite validation' + JSON.stringify(queryRewriteValidationResult)
			);

			if (!queryRewriteValidationResult.valid) {
				rewrittenUserQuery = query;
			}

			throwIfAborted(signal);
			const docs = await this.contentRepository.query({
				query: rewrittenUserQuery,
				type: Content.KNOWLEDGE_BASE
			});
			throwIfAborted(signal);
			rerankedDocs = await this.rerankService.rerank(rewrittenUserQuery, docs);
			const afterRetrievelGuardResult = await this.guardManager
				.getChain<MyDocument[]>(GuardEvents.AFTER_RETRIEVAL)
				.execute(rerankedDocs, {});
			rerankedDocs = afterRetrievelGuardResult.data;
		}
		return rerankedDocs;
	}
}

