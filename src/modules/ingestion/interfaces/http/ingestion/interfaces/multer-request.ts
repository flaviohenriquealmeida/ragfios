// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License
export interface MulterRequest extends Request {
	files: Express.Multer.File[]; // single file upload
}

