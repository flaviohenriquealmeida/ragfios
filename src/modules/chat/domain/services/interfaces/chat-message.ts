// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Role } from '../../../../../shared/domain/enums/role';

export interface ChatMessage {
	role: Role;
	content: string;
}

