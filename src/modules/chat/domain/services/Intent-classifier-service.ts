import { ClassificationResult } from '../../domain/services/interfaces/classification-result';
import { IntentSafetyGuardResult } from '../../domain/services/interfaces/intent-safety-guard-result';

export interface IntentClassifierService {
	getPromptClassification(userPrompt: string): Promise<ClassificationResult>;
	doIntentSafetyGuard(userQuery: string): Promise<IntentSafetyGuardResult>;
}

