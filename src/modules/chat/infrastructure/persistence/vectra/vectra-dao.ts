// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { LocalIndex, MetadataTypes } from 'vectra';
import { embed } from '../../ai/embedder/embedder';
import { ContentRepository } from '../../../domain/repositories/content.repository';
import { Content } from '../../../../../shared/domain/enums/content';

export class VectraDAO implements ContentRepository {
	private MIN_SIMILARITY_SCORE = 0.65;
	private readonly BROAD_TOP_K = 12; // 12 for small model, 20 for a bigger.. need to change this based on the profile.

	constructor(
		private readonly vectraIndex: Readonly<LocalIndex<Record<string, MetadataTypes>>>
	) {}

	public async addChunk(
		vector: number[],
		metadata: Record<string, MetadataTypes>
	): Promise<void> {
		await this.vectraIndex.insertItem({
			vector,
			metadata
		});
	}

	public async query(params: {
		query: string;
		type: Content;
	}): Promise<{ id: string; text: string; score: number }[]> {
		const vector = await embed(params.query);
		const results = await this.vectraIndex.queryItems(vector, params.query, this.BROAD_TOP_K);
		console.log(results);
		return results
			.filter((r) => r.score >= this.MIN_SIMILARITY_SCORE)
			.map((r, i) => ({
				id: (r.item.metadata.id as string) || (i + 1).toString(),
				text: r.item.metadata.text as string,
				score: r.score
			}));
	}
}

