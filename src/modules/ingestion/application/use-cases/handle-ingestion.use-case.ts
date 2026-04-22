// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { ContentRepository } from '../../../chat/domain/repositories/content.repository';
import { cleanText, splitTextIntoChunks } from '../../interfaces/http/ingestion/utils/chunker';
import { extractText } from '../../interfaces/http/ingestion/utils/extractor';
import { MyLogger } from '../../../../shared/ports/my-logger/my-logger';
import { embed } from '../../../chat/infrastructure/ai/embedder/embedder';

export class HanndleIngestionUseCase {
	constructor(
		private contentRepository: ContentRepository,
		private logger: MyLogger
	) {}

	public async execute(files: Express.Multer.File[]): Promise<void> {
		try {
			for (const file of files) {
				const filePath = file.path;

				const tempText = await extractText(filePath);

				// anchor chunk disabled until ingestiona accept types. See generateAnchorChunk

				const text = cleanText(tempText);
				const chunks = splitTextIntoChunks(text, 120, 40);

				this.logger.info(`[uploads] Chunking  ${file.originalname}`);
				for (let i = 0; i < chunks.length; i++) {
					const embeddingArray = await embed(chunks[i]);
					await this.contentRepository.addChunk(embeddingArray, {
						text: chunks[i],
						fileName: file.originalname,
						chunkIndex: i,
						source: 'llm'
					});
				}

				this.logger.info(`[uploads] Chunking finished  ${file.originalname}`);
			}
		} catch (err) {
			const message = 'Error processing document';
			this.logger.error(message, { err });
			throw new Error(message, {
				cause: err
			});
		}
	}
}

