// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { ChatMessage } from './chat-message';

export interface LMResponse {
	id: string;
	object: string;
	choices: {
		index: number;
		message: ChatMessage;
		finish_reason: string;
	}[];
}

