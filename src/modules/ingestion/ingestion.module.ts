// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { contentRepository, myLogger } from '../../shared/infrastructure/infrastructure.module';
import { HanndleIngestionUseCase } from './application/use-cases/handle-ingestion.use-case';

const hanndleIngestionUseCase = new HanndleIngestionUseCase(contentRepository, myLogger);

export { hanndleIngestionUseCase };

