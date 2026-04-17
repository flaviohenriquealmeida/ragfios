import { getConfig } from '../../infrastructure/ai/rag/config-factory';
import { ContentRepository } from '../../modules/chat/domain/repositories/content.repository';
import { getStorage } from '../../modules/chat/infrastructure/persistence/vectra/vectra-connection';
import { VectraDAO } from '../../modules/chat/infrastructure/persistence/vectra/vectra-dao';
import { LMService } from '../ports/ai/lm.service';
import { LMServiceImpl } from './ai/services/lm.service.impl';
import { createLogger } from './logger/pinno-logger';

const ragConfig = getConfig();
const myLogger = createLogger();
const lmService: LMService = new LMServiceImpl(ragConfig, myLogger);

let _contentRepository: ContentRepository | null = null;

const contentRepository: ContentRepository = new Proxy({} as ContentRepository, {
	get: <K extends keyof ContentRepository>(
		_target: ContentRepository,
		prop: K
	): ContentRepository[K] => {
		// 1. Initialize once
		if (!_contentRepository) {
			_contentRepository = new VectraDAO(getStorage());
		}

		// 2. Safely get the property/method
		const value = _contentRepository[prop];

		// 3. Bind methods so 'this' remains the VectraDAO instance
		if (typeof value === 'function') {
			return value.bind(_contentRepository) as ContentRepository[K];
		}

		return value;
	}
});

export { ragConfig, myLogger, lmService, contentRepository };

