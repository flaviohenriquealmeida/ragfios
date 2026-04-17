// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { MetadataTypes } from 'vectra'; // decouple from Vectra later
import { Content } from '../../../../shared/domain/enums/content';

export interface ContentRepository {
	addChunk(vector: number[], metadata: Record<string, MetadataTypes>): Promise<void>;
	query(params: { query: string; type: Content }): Promise<MyDocument[]>;
}

//TODO remove from this file
export interface MyDocument {
	id: string;
	text: string;
	score: number;
}

