// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Guard } from '../guard';
import { GuardResult } from '../guard-result';

export class CreditCardRedactionGuard implements Guard<string> {
	name = CreditCardRedactionGuard.name;

	async run(input: string): Promise<GuardResult<string>> {
		// Matches 13–16 digit card numbers (with spaces or dashes)
		const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;

		const redacted = input.replace(ccRegex, (match) => {
			const digits = match.replace(/[^\d]/g, '');

			// Optional: validate with Luhn to reduce false positives
			if (!this.isValidCard(digits)) {
				return match; // leave it unchanged
			}

			return '[REDACTED_CREDIT_CARD]';
		});

		return {
			success: true,
			data: redacted,
			guard: this.name
		};
	}

	// Luhn algorithm (basic validation)
	private isValidCard(number: string): boolean {
		let sum = 0;
		let shouldDouble = false;

		for (let i = number.length - 1; i >= 0; i--) {
			let digit = parseInt(number[i]);

			if (shouldDouble) {
				digit *= 2;
				if (digit > 9) digit -= 9;
			}

			sum += digit;
			shouldDouble = !shouldDouble;
		}

		return sum % 10 === 0;
	}
}

