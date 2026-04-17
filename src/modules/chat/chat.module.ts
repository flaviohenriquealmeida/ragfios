// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { createGuardManager } from '../../shared/application/guard-manager/create-guard-manager';
import {
	contentRepository,
	lmService,
	myLogger,
	ragConfig
} from '../../shared/infrastructure/infrastructure.module';

import { HandleChatUserCase } from './application/use-cases/handle-chat.use-case';
import { ConversationRepository } from './domain/repositories/conversation.repository';
import { ConversationService } from './domain/services/conversation.service';
import { IntentClassifierService } from './domain/services/Intent-classifier-service';
import { QueryExpansionService } from './domain/services/query-expansion.service';
import { RerankingService } from './domain/services/reranking.service';
import { RetrievalOrchestratorService } from './domain/services/retrieval-orchestrator.service';
import { SummarizationService } from './domain/services/summarization.service';
import { MarkDownPromptComposer } from './infrastructure/ai/prompts/markdown-prompt-composer';
import { ConversationImplService } from './infrastructure/ai/services/conversation-impl.service';
import { IntentClassifierImplSevice } from './infrastructure/ai/services/intent-classifier-impl.service';
import { QueryExpansionImplService } from './infrastructure/ai/services/query-expansion-impl.service';
import { RerankingImplService } from './infrastructure/ai/services/reranking-impl.service';
import { RetrievalOrchestratorImplService } from './infrastructure/ai/services/retrieval-orchestrator-impl';
import { SummarizationImplService } from './infrastructure/ai/services/summarization-impl';
import { ConversationDAO } from './infrastructure/persistence/typeorm/conversation.dao';

const conversationRepository: ConversationRepository = new ConversationDAO();
const conversationService: ConversationService = new ConversationImplService(
	conversationRepository
);
const guardManager = createGuardManager();
const rerankService: RerankingService = new RerankingImplService(lmService, ragConfig);
const queryExpansionService: QueryExpansionService = new QueryExpansionImplService(
	ragConfig,
	lmService
);
const intentClassifierService: IntentClassifierService = new IntentClassifierImplSevice(
	ragConfig,
	lmService,
	myLogger
);
const summarizationService: SummarizationService = new SummarizationImplService(
	ragConfig,
	lmService
);

const retrievalOrchestratorService: RetrievalOrchestratorService =
	new RetrievalOrchestratorImplService(
		intentClassifierService,
		queryExpansionService,
		contentRepository,
		rerankService,
		guardManager,
		myLogger
	);

const promptComposerService = new MarkDownPromptComposer(ragConfig);
const handleChatUserCase = new HandleChatUserCase(
	conversationService,
	conversationRepository,
	lmService,
	guardManager,
	myLogger,
	summarizationService,
	retrievalOrchestratorService,
	promptComposerService
);

export {
	conversationService,
	conversationRepository,
	contentRepository,
	guardManager,
	rerankService,
	queryExpansionService,
	intentClassifierService,
	summarizationService,
	handleChatUserCase,
	retrievalOrchestratorService
};

