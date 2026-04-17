// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Budget } from '../../../shared/domain/budgets/interfaces/budget';

export interface RAGConfig {
	lm: {
		chat: {
			url: string;
			model: string;
			temperature: number;
			maxContextSize: number;
			budget: Readonly<Budget>;
			system: {
				role: string;
				prompt: {
					file: string;
					template: string;
				};
			};
		};
		classification: {
			url: string;
			model: string;
			system: {
				role: string;
				prompt: {
					file: string;
					template: string;
				};
			};
		};
		queryRewrite: {
			url: string;
			model: string;
			system: {
				role: string;
				prompt: {
					file: string;
					template: string;
				};
			};
		};
		prompts: {
			conversationContext: {
				role: string;
				file: string;
				template: string;
			};
			summarization: {
				role: string;
				file: string;
				template: string;
			};
			intentSafety: {
				role: string;
				file: string;
				template: string;
			};
			rerank: {
				system: {
					role: string;
					file: string;
					template: string;
				};
				user: {
					file: string;
					template: string;
				};
			};
		};
	};
}

export interface LMConfig {
	lm: {
		chat: {
			url: string;
			model: string;
			temperature: number;
			maxContextSize: number;
			system: {
				role: string;
				file: string;
			};
		};
		classification: {
			url: string;
			model: string;
			system: {
				role: string;
				file: string;
			};
		};
		queryRewrite: {
			url: string;
			model: string;
			system: {
				role: string;
				file: string;
			};
		};
		prompts: {
			conversationContext: {
				role: string;
				file: string;
			};
			summarization: {
				role: string;
				file: string;
			};
			intentSafety: {
				role: string;
				file: string;
			};
			rerank: {
				system: {
					role: string;
					file: string;
				};
				user: {
					file: string;
				};
			};
		};
	};
}

