import { RAGConfig } from '../../../../../infrastructure/ai/rag/rag-config';
import { buildBudget } from '../../../../../shared/domain/budgets/build-budget';
import { Role } from '../../../../../shared/domain/enums/role';
import { PromptComposerService } from '../../../../../shared/ports/prompt-composer/prompt-composer';
import { MyDocument } from '../../../domain/repositories/content.repository';
import { ChatMessage } from '../../../domain/services/interfaces/chat-message';

export class MarkDownPromptComposer implements PromptComposerService {
	private readonly templateExpression = /\{\{[^{}]*\}\}/g;
	private readonly SEP = '\n---\n';
	constructor(private readonly config: RAGConfig) {}

	compose(params: {
		query: string;
		summary: string | null;
		history: ChatMessage[];
		docs: MyDocument[];
	}): ChatMessage[] {
		const { query, summary, history, docs } = params;
		const totalContext = this.config.lm.chat.maxContextSize;

		const overhead = this.tokenCounter(this.getAllTemplates());
		const budget = buildBudget(totalContext - overhead);
		const summaryToRender = summary ? summary : '';

		const safeHistory = this.fitHistoryAndSummary(
			history,
			summaryToRender,
			budget.input.history
		);
		const safeRag = this.fitRAG(docs, budget.input.rag);
		const context = this.renderConversationContext({
			safeHistory,
			safeRag,
			summary: summaryToRender,
			query
		});
		return [
			{
				role: this.config.lm.chat.system.role as Role,
				content: this.getSystemPromptTemplate()
			},
			{ role: this.config.lm.prompts.conversationContext.role as Role, content: context }
		];
	}

	private renderConversationContext(params: {
		safeHistory: string;
		summary: string;
		safeRag: string;
		query: string;
	}): string {
		return this.config.lm.prompts.conversationContext.template
			.replace('{{conversationSummary}}', params.summary)
			.replace('{{conversationHistory}}', params.safeHistory)
			.replace('{{lastUserMessage}}', params.query)
			.replace('{{ragContext}}', params.safeRag);
	}

	private fitHistoryAndSummary(history: ChatMessage[], summary: string, limit: number): string {
		if (summary.length === 0) {
			summary =
				'No prior conversation summary available. This is a new or recently started interaction.';
		}

		const summaryTokens = this.tokenCounter(summary);
		let currentHistoryTokens = 0;
		const availableForHistory = limit - summaryTokens;

		const result = [];
		if (history.length === 0) {
			return 'No recent history. This is the beginning of the conversation.';
		}
		for (const msg of [...history].reverse()) {
			const text = `${msg.role}: ${msg.content}\n`;
			const tokens = this.tokenCounter(text);

			if (currentHistoryTokens + tokens <= availableForHistory) {
				result.unshift(text);
				currentHistoryTokens += tokens;
			} else break;
		}
		return result.length > 0
			? result.join('')
			: 'No recent history fits within the current context budget.';
	}

	private fitRAG(docs: MyDocument[], limit: number): string {
		if (docs.length === 0) {
			return 'No relevant documents found in the knowledge base.';
		}
		let currentTokens = 0;
		const result = [];
		for (const doc of docs) {
			const text = `${doc.text}${this.SEP}`;
			const tokens = this.tokenCounter(text);
			if (currentTokens + tokens <= limit) {
				result.push(text);
				currentTokens += tokens;
			}
		}
		return result.join('');
	}

	public getAllTemplates(): string {
		return (this.getSystemPromptTemplate() + this.getConversationPromptTemplate()).replaceAll(
			this.templateExpression,
			''
		);
	}

	private tokenCounter(content: string): number {
		return content.length;
	}
	private getSystemPromptTemplate(): string {
		return this.config.lm.chat.system.prompt.template;
	}

	private getConversationPromptTemplate(): string {
		return this.config.lm.prompts.conversationContext.template;
	}
}

