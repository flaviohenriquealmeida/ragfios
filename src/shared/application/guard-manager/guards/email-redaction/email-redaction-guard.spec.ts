// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { EmailRedactionGuard } from './email-redaction.guard';

describe(EmailRedactionGuard.name, () => {
	const guard = new EmailRedactionGuard();

	it('should redact a single email address', async () => {
		const input = 'Contact me at test@example.com';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toBe('Contact me at \\[REDACTED EMAIL\\]');
	});

	it('should redact multiple email addresses', async () => {
		const input = 'Emails: a@test.com, b@test.org';
		const result = await guard.run(input);

		expect(result.data).toBe('Emails: \\[REDACTED EMAIL\\], \\[REDACTED EMAIL\\]');
	});

	it('should not modify text without emails', async () => {
		const input = 'Hello world!';
		const result = await guard.run(input);

		expect(result.data).toBe(input);
	});

	it('should handle uppercase emails (case-insensitive)', async () => {
		const input = 'EMAIL ME AT TEST@EXAMPLE.COM';
		const result = await guard.run(input);

		expect(result.data).toBe('EMAIL ME AT \\[REDACTED EMAIL\\]');
	});

	it('should return empty string when input is empty', async () => {
		const input = '';
		const result = await guard.run(input);

		expect(result.data).toBe('');
	});
});

