// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License
export interface ClassificationResult {
	intent: 'chat' | 'question';
	confidence: number;
	requires_retrieval: boolean;
}

