// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Role } from '../../../../../shared/domain/enums/role';

export const createHistoryItem = (role: Role, text: string): string => {
	return `${role}: ${text}`;
};

