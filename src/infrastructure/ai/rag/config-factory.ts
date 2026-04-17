// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { LMConfig, RAGConfig } from './rag-config';

import appConfig from '../../../app.config.json';

import fs from 'fs';
import path from 'path';

import { buildBudget } from '../../../shared/domain/budgets/build-budget';
import { PromptLoader } from '../../../modules/chat/infrastructure/ai/prompts/prompt-loader';

let config: RAGConfig | null = null;
// I am overriding the file name, this is inconsistent, fix later
export const getConfig = (): RAGConfig => {
	if (config) return config;

	if (!appConfig.lm) {
		throw Error('app.config.json is missing the lm property');
	}

	const promptLoader = new PromptLoader(
		path.join(__dirname, '../../../modules/chat/infrastructure/ai/prompts/mds')
	);
	const configPath = path.join(__dirname, `../models/${appConfig.lm}.json`);
	const modelConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')) as LMConfig;
	config = {
		lm: {
			chat: {
				budget: buildBudget(modelConfig.lm.chat.maxContextSize),
				maxContextSize: modelConfig.lm.chat.maxContextSize,
				model: modelConfig.lm.chat.model,
				system: {
					role: modelConfig.lm.chat.system.role,
					prompt: {
						file: modelConfig.lm.chat.system.file,
						template: promptLoader.load(modelConfig.lm.chat.system.file)
					}
				},
				temperature: modelConfig.lm.chat.temperature,
				url: modelConfig.lm.chat.url
			},
			classification: {
				model: modelConfig.lm.classification.model,
				url: modelConfig.lm.classification.url,
				system: {
					role: modelConfig.lm.classification.system.role,
					prompt: {
						file: modelConfig.lm.classification.system.file,
						template: promptLoader.load(modelConfig.lm.classification.system.file)
					}
				}
			},
			queryRewrite: {
				model: modelConfig.lm.queryRewrite.model,
				url: modelConfig.lm.queryRewrite.url,
				system: {
					role: modelConfig.lm.queryRewrite.system.role,
					prompt: {
						file: modelConfig.lm.queryRewrite.system.file,
						template: promptLoader.load(modelConfig.lm.queryRewrite.system.file)
					}
				}
			},
			prompts: {
				conversationContext: {
					role: modelConfig.lm.prompts.conversationContext.role,
					file: modelConfig.lm.prompts.conversationContext.file,
					template: promptLoader.load(modelConfig.lm.prompts.conversationContext.file)
				},
				summarization: {
					role: modelConfig.lm.prompts.summarization.role,
					file: modelConfig.lm.prompts.summarization.file,
					template: promptLoader.load(modelConfig.lm.prompts.summarization.file)
				},
				intentSafety: {
					role: modelConfig.lm.prompts.intentSafety.role,
					file: modelConfig.lm.prompts.intentSafety.file,
					template: promptLoader.load(modelConfig.lm.prompts.intentSafety.file)
				},
				rerank: {
					system: {
						role: modelConfig.lm.prompts.rerank.system.role,
						file: modelConfig.lm.prompts.rerank.system.file,
						template: promptLoader.load(modelConfig.lm.prompts.rerank.system.file)
					},
					user: {
						file: modelConfig.lm.prompts.rerank.user.file,
						template: promptLoader.load(modelConfig.lm.prompts.rerank.user.file)
					}
				}
			}
		}
	};
	return config;
};

