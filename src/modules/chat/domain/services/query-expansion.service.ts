import { Conversation } from '../../domain/entities/conversation';
import { QueryRewriteValidationResult } from '../../infrastructure/ai/utils/validate-query-rewrite';

export interface QueryExpansionService {
	validateQueryRewrite(params: {
		originalUserQuery: string;
		rewrittenUserQuery: string;
	}): Promise<QueryRewriteValidationResult>;

	rewriteQuery(userQuery: string, conversation: Conversation): Promise<string>;
}
