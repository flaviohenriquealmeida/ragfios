// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { env, FeatureExtractionPipeline, pipeline } from '@huggingface/transformers';
import path from 'path';

let embedder: FeatureExtractionPipeline;
let initializationPromise: Promise<void> | null = null;

const MODELS_DIR = path.join(process.cwd(), 'models');
env.localModelPath = MODELS_DIR;
env.cacheDir = MODELS_DIR;

export const initializeEmbedder = async (): Promise<void> => {
	if (initializationPromise) return initializationPromise;

	initializationPromise = (async (): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		embedder = await (pipeline as any)('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
			device: 'cpu',
			local_files_only: true,
			dtype: 'q8'
		});

		await embedder('warmup', { pooling: 'mean', normalize: true });
		console.log('[embedder] Initialized');
	})();

	return initializationPromise;
};

export const embed = async (text: string): Promise<number[]> => {
	if (!embedder) await initializeEmbedder();

	const output = await embedder(text, {
		pooling: 'mean',
		normalize: true
	});

	return Array.from(output.data as Float32Array);
};

