// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Guard } from '../guard';
import { GuardResult } from '../guard-result';

export class EmailRedactionGuard implements Guard<string> {
	name = EmailRedactionGuard.name;

	async run(input: string): Promise<GuardResult<string>> {
		const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

		const redacted = input.replace(emailRegex, '\\[REDACTED EMAIL\\]');

		return {
			success: true,
			data: redacted,
			guard: this.name
		};
	}
}

