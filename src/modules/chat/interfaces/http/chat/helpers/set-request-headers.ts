// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Response } from 'express';

export const setRequestHeaders = (res: Response): void => {
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.setHeader('Transfer-Encoding', 'chunked');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('X-Accel-Buffering', 'no');
};

