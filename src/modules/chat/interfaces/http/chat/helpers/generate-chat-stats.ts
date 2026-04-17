// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { encoding_for_model } from '@dqbd/tiktoken';
import { joinParts } from './join-parts';
import { normalizePrompt } from '../../../../infrastructure/ai/utils/normalize-prompt';

export const generateChatStats = (param: {
	firstTokenTime: number | null;
	requestStartTime: number;
	startTime: number;
	fullText: string;
}): string => {
	const enc = encoding_for_model('gpt-4'); // Choose your model
	const endTime = Date.now();
	const ttftSeconds = param.firstTokenTime
		? (param.firstTokenTime - param.requestStartTime) / 1000
		: 0;
	const totalLatencySeconds = (endTime - param.startTime) / 1000;
	const generationTimeSeconds = param.firstTokenTime
		? (endTime - param.firstTokenTime) / 1000
		: 0;
	const totalTokens = enc.encode(param.fullText).length;

	const tokensPerSecond = (totalTokens / generationTimeSeconds).toFixed(2);

	return (
		'\n\n' +
		normalizePrompt(
			joinParts(
				`- **Tokens/sec (generation):** ${tokensPerSecond}`,
				`- **Total tokens:** ${totalTokens}`,
				`- **Time to first token:** ${ttftSeconds.toFixed(2)}s`,
				`- **Total latency:** ${totalLatencySeconds.toFixed(2)}s`
			)
		)
	);
};

