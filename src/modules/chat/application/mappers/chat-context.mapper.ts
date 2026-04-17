import { ContextSnapShot } from '../../domain/entities/interfaces/context-snapshot';

export class ChatContextMapper {
	/**
	 * CONTEXT FOR MATH (Fixes the 0.25 Similarity error)
	 * We keep this dense and focused so the Vector Math finds the
	 * connection between "I" and "Flavio".
	 */
	static toMathContext(snapshot: ContextSnapShot, query: string): string {
		// 1. Get the core identity facts
		const summary = snapshot.summary ? `Context: ${snapshot.summary}. ` : '';

		// 2. Get the immediate history (Last 2-3 messages max for Math)
		// We use .map to get the text and .join to make a single string
		const history = snapshot.recentMessages
			.slice(-2)
			.map((m) => m.content)
			.join(' ');

		// 3. Assemble the "Original" string
		// Format: "Context: Flavio is 48. Previous: Hello. Query: How old am I?"
		return `${summary}Previous: ${history}. Query: ${query}`.trim();
	}

	/**
	 * CONTEXT FOR REWRITING - to be used when doing query rewrite using LLM, as a fallback when the
	 * consine validation fails.
	 * We give the LLM more "breath" and role labels here so it can
	 * perform a high-quality entity expansion.
	 */
	static toRewriteContext(snapshot: ContextSnapShot, userQuery: string): string {
		const fullHistory = snapshot.recentMessages
			.map((m) => `${m.role}: ${m.content}`)
			.join('\n');

		return `Summary: ${snapshot.summary}\nHistory:\n${fullHistory}\nQuery: ${userQuery}`;
	}
}

