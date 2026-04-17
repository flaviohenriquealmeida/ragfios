// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

export const joinParts = (...parts: string[]): string => {
	return parts.filter((part) => part != null && part !== '').join('\n');
};

