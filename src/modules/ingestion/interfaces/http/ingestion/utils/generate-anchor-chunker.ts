// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Role } from '../../../../../../shared/domain/enums/role';
import { lmService } from '../../../../../../shared/infrastructure/infrastructure.module';

/** In most system, AnchorChunk is enough, no need for identify chunk */
/** compressing as much as we can the prompt */
export async function generateAnchorChunk(text: string): Promise<string> {
	const prompt = `
		Retrieval summary:
		- summary
		- topics
		- keywords
		Keep original terms.

		Text:
		${text.slice(0, 2000)}
	`;

	const response = await lmService.nonStreamChat([{ role: Role.USER, content: prompt }]);
	return response.trim();
}

