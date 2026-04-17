// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Guard } from '../guard';
import { GuardResult } from '../guard-result';

export class EmptyUserQueryGuard implements Guard<string> {
	name = EmptyUserQueryGuard.name;

	async run(input: string): Promise<GuardResult<string>> {
		if (input && input.length > 0) {
			return {
				success: true,
				data: input,
				guard: this.name
			};
		} else {
			return {
				success: false,
				data: input,
				reason: 'Empty user query.',
				guard: this.name
			};
		}
	}
}

