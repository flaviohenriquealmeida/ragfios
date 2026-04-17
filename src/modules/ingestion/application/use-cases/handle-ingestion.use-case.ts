// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Content } from '../../../../shared/domain/enums/content';
import { ContentRepository } from '../../../chat/domain/repositories/content.repository';
import { cleanText, splitTextIntoChunks } from '../../interfaces/http/ingestion/utils/chunker';
import { extractText } from '../../interfaces/http/ingestion/utils/extractor';
import { generateAnchorChunk } from '../../interfaces/http/ingestion/utils/generate-anchor-chunker';
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

				const anchorChunk = await generateAnchorChunk(tempText);
				const embeddedAnchorChunk = await embed(anchorChunk);

				this.logger.info(`[uploads] adding anchor chunk for  ${file.originalname}`);
				// add ID here
				await this.contentRepository.addChunk(embeddedAnchorChunk, {
					text: anchorChunk,
					fileName: file.originalname,
					chunkIndex: -1,
					type: Content.ANCHOR
				});

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
			this.logger.error('Error processing document', { err });
			throw 'Error processing document';
		}
	}
}

