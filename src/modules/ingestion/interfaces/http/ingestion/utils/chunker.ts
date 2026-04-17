// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { split } from 'sentence-splitter';

export function splitTextIntoChunks(text: string, maxWords = 500, overlapWords = 100): string[] {
	const nodes = split(text);
	const sentences = nodes.filter((n) => n.type === 'Sentence').map((n) => n.raw);

	const chunks: string[] = [];
	let currentChunk: string[] = [];
	let wordCount = 0;

	for (let i = 0; i < sentences.length; i++) {
		const sentence = sentences[i];
		const sentenceWords = sentence.split(/\s+/).length;

		if (wordCount + sentenceWords > maxWords) {
			chunks.push(currentChunk.join(' '));

			const overlap: string[] = [];
			let overlapCount = 0;

			for (let j = currentChunk.length - 1; j >= 0; j--) {
				const w = currentChunk[j].split(/\s+/).length;
				if (overlapCount + w > overlapWords) break;
				overlap.unshift(currentChunk[j]);
				overlapCount += w;
			}

			currentChunk = overlap;
			wordCount = overlapCount;
		}

		currentChunk.push(sentence);
		wordCount += sentenceWords;
	}

	if (currentChunk.length) {
		chunks.push(currentChunk.join(' '));
	}

	return chunks;
}

export function cleanText(text: string): string {
	return text
		.replace(/\n+/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/([a-z])([A-Z])/g, '$1. $2') // inject missing sentence breaks
		.trim();
}

