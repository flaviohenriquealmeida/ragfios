// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { GuardContext } from './guard-context';
import { GuardResult } from './guard-result';

export interface Guard<T> {
	name: string;

	run(input: T, context: GuardContext): Promise<GuardResult<T>>;
}

