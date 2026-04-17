// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import http from 'http';
import 'reflect-metadata'; // needed by TYPEORM

import { initializeEmbedder } from './modules/chat/infrastructure/ai/embedder/embedder';
import { initializeStorage } from './modules/chat/infrastructure/persistence/vectra/vectra-connection';
import { AppDataSource } from './modules/chat/infrastructure/persistence/typeorm/app-data-source';
import { app } from './infrastructure/config/express/express';
import { createLogger } from './shared/infrastructure/logger/pinno-logger';
(async (): Promise<void> => {
	const logger = createLogger();
	await initializeEmbedder();
	await initializeStorage();
	await AppDataSource.initialize().then(() =>
		logger.info('[server] SQL data source initialized')
	);
	const server = http.createServer(app);
	server.listen(3000, () => {
		const address = server.address();
		if (address && typeof address !== 'string') {
			logger.info(`[server] Server listening on port ${address.port}`);
		}
	});
})();

