// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT Licenseimport { Guard } from '../interfaces/guard';

import { createLogger } from '../../../infrastructure/logger/pinno-logger';
import { Guard } from '../guards/guard';
import { GuardContext } from '../guards/guard-context';
import { GuardResult } from '../guards/guard-result';

export class GuardChain<T> {
	private logger = createLogger();
	constructor(private guards: Guard<T>[]) {}

	async execute(input: T, context: GuardContext): Promise<GuardResult<T>> {
		let current = input;

		for (const guard of this.guards) {
			this.logger.info(`[GuardChain] executing ${guard.name}`);
			const result = await guard.run(current, context);

			if (!result.success) {
				return {
					success: false,
					data: current, // last safe state
					guard: guard.name,
					reason: result.reason
				};
			}
			current = result.data;
		}

		return {
			success: true,
			data: current,
			guard: 'GuardChain' // TODO, what should it be called?
		};
	}
}

