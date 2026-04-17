// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { buildBudget } from '../../../../domain/budgets/build-budget';
import { ragConfig } from '../../../../infrastructure/infrastructure.module';
import { Guard } from '../guard';
import { GuardResult } from '../guard-result';

export class MaxLenghGuard implements Guard<string> {
	name = MaxLenghGuard.name;
	budget = buildBudget(ragConfig.lm.chat.maxContextSize);

	async run(input: string): Promise<GuardResult<string>> {
		const trimmed = input.trim();
		const isValidLength = trimmed.length <= this.budget.input.user;
		const isNumeric = this.isNumber(trimmed);

		if (isValidLength || isNumeric) {
			return {
				success: true,
				data: input,
				guard: this.name
			};
		}
		// TODO, change to return a translation KEY.
		return {
			success: false,
			data: input,
			reason: 'Query too long',
			guard: this.name
		};
	}

	// TODO extract into a helper, it is used by another guard
	private isNumber(input: string): boolean {
		return !Number.isNaN(Number(input)) && input.trim() !== '';
	}
}

