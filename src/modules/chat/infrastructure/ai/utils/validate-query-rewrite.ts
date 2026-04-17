// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

export const validateQueryRewrite = (params: {
	embOriginalUserQuery: number[];
	embRewrittenUserQuery: number[];
}): QueryRewriteValidationResult => {
	const similarity = cosineSimilarity(params.embOriginalUserQuery, params.embRewrittenUserQuery);

	if (similarity < 0.6) {
		return {
			valid: false,
			reason: 'semantic drift',
			similarity
		};
	}

	return {
		valid: true,
		similarity
	};
};

export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
	const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);

	const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
	const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

	return dot / (normA * normB);
};

export interface QueryRewriteValidationResult {
	valid: boolean;
	similarity: number;
	reason?: string;
}

