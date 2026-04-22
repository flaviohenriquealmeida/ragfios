// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { WebSocket } from 'ws';
import { handleChatUserCase } from '../../../chat.module';
import { formatChunk } from './helpers/format-chunk';
import { myLogger } from '../../../../../shared/infrastructure/infrastructure.module';

export const chatGateway = (ws: WebSocket): void => {
	let activeAbortController: AbortController | null = null;

	ws.on('message', async (rawData) => {
		try {
			const message = JSON.parse(rawData.toString());

			if (message.action === 'api:prompt') {
				if (activeAbortController) activeAbortController.abort();

				activeAbortController = new AbortController();
				const { prompt, conversationId } = message.payload;

				await handleChatUserCase.execute({
					userQuery: prompt,
					conversationId,
					signal: activeAbortController.signal,

					writeStreamResponse: (textChunk) => {
						if (ws.readyState === WebSocket.OPEN) {
							ws.send(textChunk);
						}
					},
					writeFinalStreamResponse: (finalChunk) => {
						if (ws.readyState === WebSocket.OPEN) {
							ws.send(finalChunk);
						}
						activeAbortController = null;
					}
				});
			}
		} catch {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(formatChunk({ type: 'error', delta: 'Execution failed' }));
			}
		}
	});

	ws.on('close', () => {
		myLogger.info('[server] WebSocket connection closed - Cleaning up resources');
		if (activeAbortController) {
			activeAbortController.abort();
		}
	});
};

