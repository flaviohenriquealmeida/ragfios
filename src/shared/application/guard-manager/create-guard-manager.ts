// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { GuardManager } from './guard-manager';
import { CreditCardRedactionGuard } from './guards/credit-card-redaction/credit-card-redaction.guard';
import { EmailRedactionGuard } from './guards/email-redaction/email-redaction.guard';
import { EmptyUserQueryGuard } from './guards/empty-prompt/empty-prompt.guard';
import { MinLengthGuard } from './guards/min-length/min-length.guard';
import { InputSafetyGuard } from './guards/intent-safety/input-policy.guard';
import { XSSSanitizationGuard } from './guards/xss-sanitization/xss-sanitization-guard';
import { GuardEvents } from './types/guard-events';
import { MaxLenghGuard } from './guards/max-length/max-length.guard';
import { CollectionGuard } from './collection-guard';
import { MyDocument } from '../../../modules/chat/domain/repositories/content.repository';

export function createGuardManager(): GuardManager {
	const manager = new GuardManager();

	const emailRedactionGuard = new EmailRedactionGuard();
	const creditCardRedactionGuard = new CreditCardRedactionGuard();
	// BEFORE_INPUT
	manager.register(GuardEvents.BEFORE_INPUT, new EmptyUserQueryGuard());
	manager.register(GuardEvents.BEFORE_INPUT, new MaxLenghGuard());
	manager.register(GuardEvents.BEFORE_INPUT, new MinLengthGuard());
	manager.register(GuardEvents.BEFORE_INPUT, new XSSSanitizationGuard());
	manager.register(GuardEvents.BEFORE_INPUT, new InputSafetyGuard());
	manager.register(GuardEvents.BEFORE_INPUT, emailRedactionGuard);
	manager.register(GuardEvents.BEFORE_INPUT, creditCardRedactionGuard);

	manager.register(
		GuardEvents.AFTER_RETRIEVAL,
		new CollectionGuard<MyDocument>(
			emailRedactionGuard,
			(doc) => doc.text, // How to get the string
			(doc, val) => ({ ...doc, text: val }) // How to update it
		)
	);

	// AFTER RETRIEVAL
	manager.register(
		GuardEvents.AFTER_RETRIEVAL,
		new CollectionGuard<MyDocument>(
			creditCardRedactionGuard,
			(doc) => doc.text, // How to get the string
			(doc, val) => ({ ...doc, text: val }) // How to update it
		)
	);

	return manager;
}

