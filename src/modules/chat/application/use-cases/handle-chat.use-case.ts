// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { LMService } from '../../../../shared/ports/ai/lm.service';
import { MyLogger } from '../../../../shared/ports/my-logger/my-logger';
import { Role } from '../../../../shared/domain/enums/role';
import { Conversation } from '../../domain/entities/conversation';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { formatChunk } from '../../interfaces/http/chat/helpers/format-chunk';
import { generateChatStats } from '../../interfaces/http/chat/helpers/generate-chat-stats';
import { GuardManager } from '../../../../shared/application/guard-manager/guard-manager';
import { GuardEvents } from '../../../../shared/application/guard-manager/types/guard-events';
import { PromptComposerService } from '../../../../shared/ports/prompt-composer/prompt-composer';
import { ProseStreamRefiner } from '../../interfaces/http/chat/helpers/prose-stream-refiner';
import { RetrievalOrchestratorService } from '../../domain/services/retrieval-orchestrator.service';
import { SummarizationService } from '../../domain/services/summarization.service';
import { ConversationService } from '../../domain/services/conversation.service';

export class HandleChatUserCase {
	constructor(
		private readonly conversationService: ConversationService,
		private readonly conversationRepository: ConversationRepository,
		private readonly lmService: LMService,
		private readonly guardManager: GuardManager,
		private readonly logger: MyLogger,
		private readonly summarizationService: SummarizationService,
		private readonly retrievalOrchestratorService: RetrievalOrchestratorService,
		private readonly promptComposerService: PromptComposerService
	) {}

	public async execute(params: {
		userQuery: string;
		conversationId: string;
		signal: AbortSignal;
		writeStreamResponse: (text: string) => void;
		writeFinalStreamResponse: (text: string) => void;
	}): Promise<void> {
		try {
			const result = await this.guardManager
				.getChain<string>(GuardEvents.BEFORE_INPUT)
				.execute(params.userQuery, {});

			if (!result.success) {
				const guardFailMessage = formatChunk({
					type: 'text',
					delta: result.reason ? result.reason : 'Something went wrong'
				});
				params.writeFinalStreamResponse(guardFailMessage);
				return;
			}

			const safeUserQuery = result.data;

			const conversation = await this.conversationService.findOrCreateConversation({
				conversationId: params.conversationId,
				newConversationTitle: safeUserQuery
			});

			let activeMessages = conversation.getActiveMessages();

			if (conversation.isSummarizationNeeded({ maxHistory: 6 })) {
				const summaryText =
					await this.summarizationService.createSummarization(activeMessages);
				await conversation.archiveHistory(summaryText);
				activeMessages = [];
			}

			/** RAG operations are expensive. We want to check for aborted connection
			 * before each key event during the response
			 */

			const rerankedDocs = await this.retrievalOrchestratorService.retrieveContext(
				safeUserQuery,
				conversation,
				params.signal
			);

			const prompt = this.promptComposerService.compose({
				query: safeUserQuery,
				summary: conversation.getLatestSummaryText(),
				docs: rerankedDocs,
				history: activeMessages
			});

			conversation.addMessage(Conversation.createMessageFrom(Role.USER, safeUserQuery));

			const requestStartTime = Date.now();
			const stream = await this.lmService.chat(prompt, params.signal);

			// Wrap stream events in a Promise to ensure lifecycle completion
			return await new Promise((resolve, reject) => {
				/*
				In my Promise, I am adding listeners to stream. While Node.js usually cleans these up when 
				the stream is destroyed, it's safer to explicitly remove them to prevent "MaxListenersExceededWarning" 
				if the server handles many concurrent chats.
				*/
				const cleanup = (): void => {
					params.signal.removeEventListener('abort', onAbort);
					stream.removeAllListeners();
				};

				const onAbort = (): void => {
					cleanup();
					stream.destroy();
					reject({ name: 'AbortError' });
				};

				// this event will be fired when the abort signal aborts
				params.signal.addEventListener('abort', onAbort);

				let buffer = '';
				let firstTokenTime: number | null = null;
				let fullText = '';
				const startTime = Date.now();

				// 1. Instantiate the refiner at the start of the execute method (ensure fresh state)
				const streamRefiner = new ProseStreamRefiner(this.logger);

				// 2. The streamlined data listener
				stream.on('data', (chunk) => {
					buffer += chunk.toString();
					let boundary = buffer.indexOf('\n\n');

					while (boundary !== -1) {
						const completeMessage = buffer.slice(0, boundary).trim();
						buffer = buffer.slice(boundary + 2);

						if (completeMessage.startsWith('data: ')) {
							const rawData = completeMessage.replace('data: ', '');
							if (rawData === '[DONE]') break;

							try {
								const parsed = JSON.parse(rawData);
								const delta = parsed.choices?.[0]?.delta?.content || '';

								if (delta) {
									if (!firstTokenTime) firstTokenTime = Date.now();

									// Map the raw delta through the refiner
									// This handles buffering, tag extraction, logging, and stripping
									const refinedDelta = streamRefiner.handleDelta(
										delta,
										params.conversationId
									);

									if (refinedDelta !== null) {
										fullText += refinedDelta;
										params.writeStreamResponse(
											formatChunk({ type: 'text', delta: refinedDelta })
										);
									}
								}
							} catch (err) {
								this.logger.error('[chat-api] error parsing chunk', { err });
							}
						}
						boundary = buffer.indexOf('\n\n');
					}
				});

				stream.on('error', (err) => {
					cleanup();
					this.logger.error('[chat-api] stream error', { err });
					reject(err);
				});

				stream.on('end', async () => {
					cleanup();
					try {
						const message = Conversation.createMessageFrom(Role.ASSISTANT, fullText);
						conversation.addMessage(message);

						// Crucial: Wait for the save to finish before resolving the promise
						await this.conversationRepository.save(conversation);

						params.writeFinalStreamResponse(
							formatChunk({
								type: 'done',
								stats: generateChatStats({
									firstTokenTime,
									fullText,
									requestStartTime,
									startTime
								})
							})
						);
						resolve();
					} catch (dbErr) {
						this.logger.error('[chat-api] error saving conversation', { dbErr });
						reject(dbErr);
					}
				});
			});
		} catch (err) {
			if ((err as { name: string }).name === 'AbortError') return; // Exit silently
			this.logger.error(`[${HandleChatUserCase.name}] Critical Failure`, { err });
			params.writeFinalStreamResponse(
				formatChunk({
					type: 'text',
					delta: 'An unexpected error occurred while processing your request.'
				})
			);
		}
	}
}

