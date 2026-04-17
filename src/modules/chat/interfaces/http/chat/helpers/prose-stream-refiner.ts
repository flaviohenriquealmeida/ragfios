// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { MyLogger } from '../../../../../../shared/ports/my-logger/my-logger';

/**
 * ProseStreamRefiner is responsible for transforming a raw AI stream into clean prose.
 * It intercepts and strips protocol tags (e.g., [NOT_FOUND]) at the start of the stream
 * while ensuring business-relevant events are logged for observability.
 */
export class ProseStreamRefiner {
	// Temporary buffer that accumulates incoming stream chunks
	// until we are confident we can safely process/remove header tags
	private buffer = '';

	// Flag indicating whether the initial header has already been processed
	// Once true → class switches to pure pass-through mode
	private hasReleasedInitial = false;

	// Regex to match one or more leading tags like:
	// "   [TAG_ONE] [TAG_TWO] "
	// - ^ ensures it only matches at the start
	// - \s* allows leading whitespace
	// - (\[[A-Z_]+\]\s*)+ matches one or more tags with optional trailing spaces
	private readonly tagRegex = /^\s*(\[[A-Z_]+\]\s*)+/;

	constructor(private readonly logger: MyLogger) {}

	/**
	 * Processes a new delta chunk from the LLM stream.
	 * Returns:
	 *  - null → if still buffering header/tags
	 *  - string → cleaned content ready for UI
	 */
	public handleDelta(delta: string, conversationId: string): string | null {
		// If we've already processed the header, just pass everything through
		if (this.hasReleasedInitial) return delta;

		// Accumulate incoming chunk into buffer
		// (important because tags may arrive split across chunks)
		this.buffer += delta;

		// Decide whether we have enough information to finalize the header
		if (
			// Strong signal: newline usually means header ended and content started
			this.buffer.includes('\n') ||
			// Safety fallback: don't buffer forever if input is long
			this.buffer.length > 40 ||
			// Smart detection:
			// - There is meaningful content after removing tags
			// - AND there are no incomplete tags (e.g., "[NOT_FO")
			(this.hasContentAfterTags() && !this.hasUnclosedTag())
		) {
			return this.finalizeHeader(conversationId);
		}

		// Still buffering → nothing to emit yet
		return null;
	}

	/**
	 * Checks if there is real (non-tag) content in the buffer.
	 * Removes leading tags and verifies if anything meaningful remains.
	 */
	private hasContentAfterTags(): boolean {
		// Remove leading tags
		const withoutTags = this.buffer.replace(this.tagRegex, '');

		// If after trimming whitespace something remains → it's real content
		return withoutTags.trim().length > 0;
	}

	/**
	 * Detects if there is an incomplete tag in the buffer.
	 * Example:
	 *   "[NOT_FO" → unclosed
	 *   "[NOT_FOUND]" → closed
	 */
	private hasUnclosedTag(): boolean {
		// Count number of '[' and ']'
		const open = (this.buffer.match(/\[/g) || []).length;
		const close = (this.buffer.match(/\]/g) || []).length;

		// If more '[' than ']' → there is an unfinished tag
		return open > close;
	}

	/**
	 * Extracts tags for logging and returns the cleaned text to the user
	 */
	private finalizeHeader(conversationId: string): string {
		// Capture full buffer BEFORE modifying it (for logging/analysis)
		const rawBufferForAnalysis = this.buffer;

		// Extract all tags (e.g., ["NOT_FOUND", "LOG_ONLY"])
		const tags = this.extractTags(rawBufferForAnalysis);

		// If NOT_FOUND tag exists → log warning for observability
		if (tags.includes('NOT_FOUND')) {
			this.logger.warn(
				`[${ProseStreamRefiner.name}] [NOT_FOUND] RAG Information missing for conversation: ${conversationId}`
			);
		}

		// Clean the buffer:
		const cleaned = rawBufferForAnalysis
			// Remove leading tags
			.replace(this.tagRegex, '')

			// Remove a leading newline (common boundary between header and content)
			.replace(/^\s*\n/, '')

			// Remove any remaining leading whitespace
			.trimStart();

		// Mark that we've finished header processing
		this.hasReleasedInitial = true;

		// Clear buffer to free memory and avoid reuse
		this.buffer = '';

		// Return cleaned content to the UI
		return cleaned;
	}

	/**
	 * Extracts tag names from text.
	 * Example:
	 *   "[NOT_FOUND] [LOG_ONLY]" → ["NOT_FOUND", "LOG_ONLY"]
	 */
	private extractTags(text: string): string[] {
		// Match all tags (case-insensitive just in case)
		const matches = text.match(/\[([A-Z_]+)\]/gi);

		// If no matches → return empty array
		if (!matches) return [];

		// Normalize:
		// - uppercase
		// - remove '[' and ']'
		// - trim whitespace
		return matches.map((m) => m.toUpperCase().split('[').join('').split(']').join('').trim());
	}

	/**
	 * Exposes whether the initial header has already been released.
	 */
	public isReleased(): boolean {
		return this.hasReleasedInitial;
	}
}

