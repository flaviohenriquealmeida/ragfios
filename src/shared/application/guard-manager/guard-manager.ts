// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { createLogger } from '../../infrastructure/logger/pinno-logger';
import { Guard } from './guards/guard';
import { GuardChain } from './models/guard-chain';
import { GuardEvent } from './types/guard-event';

export class GuardManager {
	private readonly registry = new Map<GuardEvent, Guard<unknown>[]>();
	private readonly logger = createLogger();

	register<T>(event: GuardEvent, guard: Guard<T>): void {
		const guards = this.registry.get(event) ?? [];
		guards.push(guard);
		this.registry.set(event, guards);
	}

	getChain<T>(event: GuardEvent): GuardChain<T> {
		this.logger.info(`[${GuardManager.name}] ${event}`);
		return new GuardChain<T>((this.registry.get(event) ?? []) as Guard<T>[]);
	}
}

