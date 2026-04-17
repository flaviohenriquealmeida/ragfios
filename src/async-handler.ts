// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async Express route handler to automatically catch errors
 * and forward them to next().
 */
export const asyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
};

