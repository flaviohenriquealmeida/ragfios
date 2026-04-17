// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Response, Request } from 'express';
import { MulterRequest } from './interfaces/multer-request';
import { hanndleIngestionUseCase } from '../../../ingestion.module';

export const ingestionController = async (
	req: Request,
	res: Response
): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
	const files = (req as unknown as MulterRequest).files;

	if (!files || files.length === 0) {
		return res.status(400).send('No files uploaded');
	}
	try {
		await hanndleIngestionUseCase.execute(files);
		res.send(`Uploaded ${files.length} files successfully`);
	} catch (err) {
		res.status(500).send(err);
	}
};

