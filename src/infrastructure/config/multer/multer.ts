// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { Express } from 'express';
import multer, { StorageEngine, Options } from 'multer';
import fs from 'fs';
import path from 'path';

export const initializeMulter = (app: Express): void => {
	// Use path.resolve to get an absolute path based on the project root
	const uploadDir: string = path.resolve(process.cwd(), 'uploads/tmp');

	// 'recursive: true' handles creating both 'uploads' and 'tmp' in one go
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	const storage: StorageEngine = multer.diskStorage({
		destination(req, file, cb) {
			// Use the same absolute path to avoid ENOENT errors
			cb(null, uploadDir);
		},
		filename(req, file, cb) {
			cb(null, file.originalname);
		}
	});

	const uploadOptions: Options = {
		storage,
		fileFilter(req, file, cb) {
			cb(null, true);
		}
	};

	const upload = multer(uploadOptions);

	app.set('upload', upload);
};
