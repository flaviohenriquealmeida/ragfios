// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { Guard } from '../guard';
import { GuardResult } from '../guard-result';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export class XSSSanitizationGuard implements Guard<string> {
	name = XSSSanitizationGuard.name;

	async run(input: string): Promise<GuardResult<string>> {
		const clean = purify.sanitize(input);

		return {
			success: true,
			data: clean,
			reason: clean !== input ? 'XSS sanitized' : undefined,
			guard: this.name
		};
	}
}

