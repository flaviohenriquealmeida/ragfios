// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Express } from 'express';
import { ingestionController } from './ingestion.controller';
import { asyncHandler } from '../../../../../async-handler';

export default (app: Express): void => {
	app.route('/api/documents/ingest').post(
		app.get('upload').array('files', 10),
		asyncHandler(ingestionController)
	);
};

