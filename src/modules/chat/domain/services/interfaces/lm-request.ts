// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { ChatMessage } from './chat-message';

export interface LMRequest {
	model: string;
	messages: ChatMessage[];
	temperature?: number;
	stream?: boolean;
	response_format?: { type: 'json_object' };
}

