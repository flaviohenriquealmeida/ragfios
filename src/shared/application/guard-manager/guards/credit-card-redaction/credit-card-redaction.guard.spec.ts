// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { CreditCardRedactionGuard } from './credit-card-redaction.guard';

describe(CreditCardRedactionGuard.name, () => {
	const guard = new CreditCardRedactionGuard();

	it('should redact valid credit card numbers', async () => {
		const input = 'My card is 4111 1111 1111 1111';

		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toContain('[REDACTED_CREDIT_CARD]');
	});

	it('should redact multiple valid credit card numbers', async () => {
		const input = 'Cards: 4111111111111111 and 4012-8888-8888-1881';

		const result = await guard.run(input);

		expect(result.data).toBe('Cards: [REDACTED_CREDIT_CARD] and [REDACTED_CREDIT_CARD]');
	});

	it('should NOT redact invalid card numbers (fail Luhn)', async () => {
		const input = 'Fake card 1234 5678 9012 3456';

		const result = await guard.run(input);

		expect(result.data).toBe(input);
	});

	it('should NOT redact short numbers', async () => {
		const input = 'Number 123456789012';

		const result = await guard.run(input);

		expect(result.data).toBe(input);
	});

	it('should preserve non-numeric text', async () => {
		const input = 'Hello world';

		const result = await guard.run(input);

		expect(result.data).toBe(input);
	});

	it('should handle mixed valid and invalid numbers', async () => {
		const input = 'Valid: 4111111111111111 Invalid: 1234567890123456';

		const result = await guard.run(input);

		expect(result.data).toBe('Valid: [REDACTED_CREDIT_CARD] Invalid: 1234567890123456');
	});

	it('should handle numbers with dashes and spaces', async () => {
		const input = 'Card: 4111-1111-1111-1111';

		const result = await guard.run(input);

		expect(result.data).toBe('Card: [REDACTED_CREDIT_CARD]');
	});

	it('should not modify text if no card numbers present', async () => {
		const input = 'Nothing sensitive here';

		const result = await guard.run(input);

		expect(result.data).toBe(input);
	});
});

