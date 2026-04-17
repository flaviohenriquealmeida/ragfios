import { getRatios } from './get-ratios';
import { Budget } from './interfaces/budget';

/**
 * Generates a token budget configuration based on a total context window size.
 *
 * This function distributes the available tokens across different prompt components
 * (RAG context, conversation history, system prompt, user input, output, and buffer)
 * using predefined ratio constants.
 *
 * The resulting budget ensures that the total allocation remains within the model's
 * maximum context window while reserving space for each part of the request lifecycle.
 *
 * @param {number} total - The total number of tokens available (i.e., the model's context window size).
 *
 * @returns {Budget} A structured budget object containing token allocations for:
 * - `input.rag`: Retrieved context (RAG)
 * - `input.history`: Conversation history
 * - `input.system`: System prompt
 * - `input.user`: User input
 * - `output`: Maximum tokens reserved for the model's response
 * - `buffer`: Safety margin to prevent overflow due to token estimation inaccuracies
 *
 * @example
 * const budget = buildBudget(8192);
 *
 * // Example output (approximate values):
 * // {
 * //   total: 8192,
 * //   input: {
 * //     rag: 3686,
 * //     history: 1229,
 * //     system: 409,
 * //     user: 409
 * //   },
 * //   output: 1638,
 * //   buffer: 819
 * // }
 *
 * @remarks
 * - Ratios are defined externally via the `RATIOS` constant.
 * - All values are proportional to the total and should be interpreted as token counts.
 * - Consider rounding values if integer token counts are required.
 * - This function does not validate that ratios sum to 1; ensure correctness of `RATIOS`.
 */
export const buildBudget = (total: number = 4096): Budget => {
	const ratios = getRatios();
	return {
		total,
		input: {
			rag: total * ratios.rag,
			history: total * ratios.history,
			system: total * ratios.system,
			user: total * ratios.user
		},
		output: total * ratios.output,
		buffer: total * ratios.buffer
	};
};

