import { Ratios } from './interfaces/ratios';

/**
 * Returns the token allocation ratios used to build a budget configuration.
 *
 * These ratios define how the total available tokens are distributed across
 * different parts of a request in a Retrieval-Augmented Generation (RAG) system:
 * - `rag`: Retrieved context (primary knowledge source)
 * - `history`: Conversation history
 * - `system`: System prompt / instructions
 * - `user`: User input
 * - `output`: Model response
 * - `buffer`: Safety margin to prevent token overflow
 *
 * The function validates that all ratios sum to 1.0 (within a small tolerance).
 * If the validation fails, an error is thrown to prevent invalid budget allocation.
 *
 * @returns {{
 *   rag: number;
 *   history: number;
 *   system: number;
 *   user: number;
 *   output: number;
 *   buffer: number;
 * }} An object containing proportional ratios for each budget category.
 *
 * @throws {Error} Throws if the sum of all ratios does not equal 1.0 (±0.001 tolerance).
 *
 * @example
 * const ratios = getRatios();
 *
 * // Example output:
 * // {
 * //   rag: 0.45,
 * //   history: 0.15,
 * //   system: 0.05,
 * //   user: 0.05,
 * //   output: 0.2,
 * //   buffer: 0.1
 * // }
 *
 * @remarks
 * - The tolerance (0.001) accounts for floating-point precision errors.
 * - Adjust ratios carefully, as they directly impact prompt composition and model performance.
 * - Increasing `rag` improves knowledge grounding, while increasing `history`
 *   favors conversational continuity.
 */
export const getRatios = (): Ratios => {
	const ratios = {
		rag: 0.45,
		history: 0.15,
		system: 0.05,
		user: 0.05,
		output: 0.2,
		buffer: 0.1
	};

	const sum = Object.values(ratios).reduce((a, b) => a + b, 0);
	if (Math.abs(sum - 1) > 0.001) {
		throw new Error('ratios must sum to 1');
	}

	return ratios;
};

