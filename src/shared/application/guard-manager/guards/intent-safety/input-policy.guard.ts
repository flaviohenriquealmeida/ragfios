// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { intentClassifierService } from '../../../../../modules/chat/chat.module';
import { Guard } from '../guard';
import { GuardResult } from '../guard-result';
import { InputValidationCategories } from './input-validation-categories';

export class InputSafetyGuard implements Guard<string> {
	name = InputSafetyGuard.name;

	// TODO -> we may want generic response because for INJECTION_ATTEMPT, not make evident that we caught it.
	private readonly reasons = new Map<string, string>([
		[
			InputValidationCategories.INJECTION_ATTEMPT,
			'System security alert: This request appears to contain adversarial instructions. ' +
				'To maintain safety, I cannot process commands that attempt to override my core logic.'
		],
		[
			InputValidationCategories.PRIVACY_ATTEMPT,
			`I'm sorry, but I don't have access to personal contact details like phone numbers or addresses. To protect privacy and security, I can only provide information based on my provided documentation.`
		],
		[
			InputValidationCategories.HATE_SPEECH,
			'This request violates our safety and content policies regarding hate speech. I am unable to provide a response to queries that target or disparage individuals or groups based on protected characteristics.'
		],
		[
			InputValidationCategories.SAFE,
			`I'm unable to respond to messages containing offensive language. Let’s stick to a respectful tone so I can better assist you with your request.`
		]
	]);

	async run(input: string): Promise<GuardResult<string>> {
		const evaluation = await intentClassifierService.doIntentSafetyGuard(input);

		if (evaluation.category !== 'SAFE') {
			return {
				success: false,
				data: input,
				reason: this.getReasonForCategory(evaluation.category),
				guard: this.name
			};
		}

		return {
			success: true,
			data: input,
			guard: this.name
		};
	}

	private getReasonForCategory(category: string): string {
		const message = this.reasons.get(category);
		return message || 'Request blocked by safety policy.';
	}
}

