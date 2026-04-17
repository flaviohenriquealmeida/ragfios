import { Conversation } from '../../domain/entities/conversation';
import { MyDocument } from '../../domain/repositories/content.repository';

export interface RetrievalOrchestratorService {
	retrieveContext(
		query: string,
		conversation: Conversation,
		signal: AbortSignal
	): Promise<MyDocument[]>;
}

