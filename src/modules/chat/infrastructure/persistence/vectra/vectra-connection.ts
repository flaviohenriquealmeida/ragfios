// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { LocalIndex, MetadataTypes } from 'vectra';
import { createLogger } from '../../../../../shared/infrastructure/logger/pinno-logger';

let index: LocalIndex<Record<string, MetadataTypes>>;
const logger = createLogger();

export const initializeStorage = async (): Promise<LocalIndex<Record<string, MetadataTypes>>> => {
	if (index) {
		logger.info('[vectra-connection] Already initialized');
		return index;
	}

	const start = Date.now();
	index = new LocalIndex('./database/vectorial/data');
	if (!(await index.isIndexCreated())) {
		logger.info('[vectra-connection] Creating database...');
		await index.createIndex();
		logger.info('[vectra-connection] Database created');
	}
	logger.info(`[vectra-connection] Ready (${Date.now() - start}ms)`);

	return index;
};

export const getStorage = (): Readonly<LocalIndex<Record<string, MetadataTypes>>> => {
	if (!index) {
		throw new Error('[vectra-connection] trying to access storage before it is initialized.');
	}
	return index;
};

