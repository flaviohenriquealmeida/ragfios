// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

/**
 * Normalizes a prompt string for LLM consumption by cleaning and standardizing whitespace.
 *
 * This function is designed for RAG pipelines and prompt construction. It removes
 * formatting artifacts such as tabs and excessive spacing while preserving meaningful
 * structure (e.g., single line breaks).
 *
 * Transformations applied:
 * - Removes tab characters (`\t`)
 * - Normalizes consecutive spaces into a single space
 * - Collapses multiple consecutive newlines into a single newline
 * - Trims leading and trailing whitespace
 *
 * This helps ensure consistent prompt formatting, improving readability and
 * potentially enhancing LLM response quality.
 *
 * @param {string} text - The raw prompt or text content to normalize
 * @returns {string} The normalized prompt string
 *
 * @example
 * const raw = "### Title\n\t\tSome   text\n\n\nMore text";
 * const result = normalizePrompt(raw);
 *
 * // Result:
 * // "### Title\nSome text\nMore text"
 */
export function normalizePrompt(text: string): string {
	return text
		.replace(/\t+/g, ' ') // remove tabs
		.replace(/[ \t]+/g, ' ') // normalize spaces
		.replace(/\n{3,}/g, '\n') // collapse multiple newlines
		.trim();
}

