// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Express } from 'express';
import { handlePrompt } from './chat.controller';
import { asyncHandler } from '../../../../../async-handler';

export default (app: Express): void => {
	app.route('/api/prompt').post(asyncHandler(handlePrompt));
};

