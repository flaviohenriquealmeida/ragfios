// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

export interface MyLogger {
	debug(message: string, meta?: LogMeta): void;
	info(message: string, meta?: LogMeta): void;
	warn(message: string, meta?: LogMeta): void;
	error(message: string, meta?: LogMeta): void;
}

export type LogMeta = Record<string, unknown> | Error;

