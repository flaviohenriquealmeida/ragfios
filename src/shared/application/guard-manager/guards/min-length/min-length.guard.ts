// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Guard } from '../guard';
import { GuardResult } from '../guard-result';

export class MinLengthGuard implements Guard<string> {
	name = MinLengthGuard.name;

	async run(input: string): Promise<GuardResult<string>> {
		const trimmed = input.trim();

		const isValidLength = trimmed.length >= 2;
		const isNumeric = this.isNumber(trimmed);

		if (isValidLength || isNumeric) {
			return {
				success: true,
				data: input,
				guard: this.name
			};
		}

		return {
			success: false,
			data: input,
			reason: 'Search term is too short. Try adding more details.',
			guard: this.name
		};
	}

	// TODO extract into a helper
	private isNumber(input: string): boolean {
		return !Number.isNaN(Number(input)) && input.trim() !== '';
	}
}

