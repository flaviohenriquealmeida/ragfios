// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

/**
 * Serializes a JavaScript value into a newline-delimited JSON (NDJSON) string.
 *
 * This is used for streaming responses where each message is sent as a separate
 * JSON object followed by a newline (`\n`) delimiter. The newline allows the
 * client to safely split and parse each chunk incrementally.
 *
 * @param data - The data to serialize. Typically a stream event object
 * (e.g. `{ type: 'text', delta: string }` or `{ type: 'done', stats: object }`).
 *
 * @returns A JSON string followed by a newline character, suitable for
 * streaming over HTTP.
 *
 * @example
 * formatChunk({ type: 'text', delta: 'Hello' });
 * // => '{"type":"text","delta":"Hello"}\n'
 */

export const formatChunk = (data: unknown): string => {
	return JSON.stringify(data) + '\n';
};

