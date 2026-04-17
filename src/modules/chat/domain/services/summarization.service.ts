import { ConversationMessage } from '../../domain/entities/message';

export interface SummarizationService {
	createSummarization(messagesToSummarize: ConversationMessage[]): Promise<string>;
}

