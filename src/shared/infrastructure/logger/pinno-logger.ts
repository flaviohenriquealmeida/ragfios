// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import pino, { Logger as PinoLogger } from 'pino';
import { LogMeta, MyLogger } from '../../ports/my-logger/my-logger';

let pinoInstance: PinoLogger;
let loggerInstance: MyLogger;

export function createLogger(): MyLogger {
	if (loggerInstance) return loggerInstance;

	const config: pino.LoggerOptions = {
		level: process.env.LOG_LEVEL || 'info'
	};
	const isDev = process.env.NODE_ENV !== 'production';
	if (isDev) {
		config.transport = {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'HH:MM:ss',
				ignore: 'pid,hostname'
			}
		};
	}
	pinoInstance = pino(config);

	loggerInstance = {
		debug: (message, meta = {}): void => pinoInstance.debug(normalizeMeta(meta), message),

		info: (message, meta = {}): void => pinoInstance.info(normalizeMeta(meta), message),

		warn: (message, meta = {}): void => pinoInstance.warn(normalizeMeta(meta), message),

		error: (message, meta = {}): void => pinoInstance.error(normalizeMeta(meta), message)
	};

	return loggerInstance;
}

const normalizeMeta = (meta?: LogMeta): Record<string, unknown> => {
	if (!meta) return {};

	if (meta instanceof Error) {
		return { err: meta };
	}

	return meta;
};

