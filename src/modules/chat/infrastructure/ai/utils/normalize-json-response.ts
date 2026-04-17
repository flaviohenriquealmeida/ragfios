// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

/**
 * SML usually fail in proper conver JSON, it tries to add a comma into the end because of its trained data.
 */
export const normalizeJsonResponse = (jsonString: string): string =>
	jsonString
		.trim()
		.replace(/,\s*\]/g, ']') // Removes [...,] -> [...]
		.replace(/,\s*\}/g, '}'); // Removes {...,} -> {...}

