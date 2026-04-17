// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Role } from '../../../../../shared/domain/enums/role';
import { ChatMessage } from '../../../domain/services/interfaces/chat-message';
import { normalizePrompt } from './normalize-prompt';

export const createMessage = (role: Role, content: string): ChatMessage => ({
	role,
	content: normalizePrompt(content)
});

