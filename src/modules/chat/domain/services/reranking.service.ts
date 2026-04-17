import { MyDocument } from '../../domain/repositories/content.repository';

export interface RerankingService {
	rerank(userQuery: string, retrievedContent: MyDocument[]): Promise<MyDocument[]>;
}

