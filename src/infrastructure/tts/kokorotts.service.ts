// infrastructure/tts/kokoro.service.ts (IN THE CHAT SERVER)

import { MyLogger } from '../../shared/ports/my-logger/my-logger';
import { TTSService, TTSRequest } from '../../shared/ports/tts/tts.service';

export class KokoroService implements TTSService {
	// LOCKED URL: No double slashes, exactly as you defined
	private readonly url = 'http://localhost:3001/api/v1/tts/stream';

	constructor(private readonly logger: MyLogger) {}

	async dispatch(request: TTSRequest): Promise<void> {
		try {
			const response = await fetch(this.url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					text: request.text,
					conversationId: request.conversationId,
					voice: request.voice ?? 'af_heart',
					speed: 1 // Default speed
				})
			});

			// If the server didn't return 200-299, the "connection" worked
			// but the "request" failed. We need to know this.
			if (!response.ok) {
				const errorDetail = await response.text();
				this.logger.error('[Chat-Server] TTS Server rejected the request', {
					status: response.status,
					errorDetail
				});
				return;
			}

			// If we reach here, the Chat Server successfully
			// handed the data to the TTS Server.
		} catch (err) {
			// This happens if the TTS Server is DOWN or the URL is wrong.
			this.logger.error('[Chat-Server] CRITICAL: Could not reach TTS Server', { err });
		}
	}
}

