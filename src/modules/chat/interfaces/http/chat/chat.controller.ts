// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Request, Response } from 'express';
import { setRequestHeaders } from './helpers/set-request-headers';
import { handleChatUserCase } from '../../../chat.module';

export const handlePrompt = async (req: Request, res: Response): Promise<void> => {
	setRequestHeaders(res);

	const abortController = new AbortController();
	// 2. If the client disconnects, trigger the abort signal
	res.on('close', () => {
		// Only abort if the response hasn't finished naturally
		if (!res.writableEnded) {
			abortController.abort();
		}
	});

	try {
		const userQuery = req.body.prompt as string;
		const conversationId = req.body.conversationId as string;
		await handleChatUserCase.execute({
			userQuery,
			conversationId,
			signal: abortController.signal,
			writeStreamResponse: (text) => res.write(text),
			writeFinalStreamResponse: (text) => {
				res.write(text);
				res.end();
			}
		});
	} catch {
		// Handle stream errors or connection breaks
		if (!res.writableEnded) {
			res.end();
		}
	}
};

