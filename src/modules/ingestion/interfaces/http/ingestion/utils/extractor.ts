// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import path from 'path';

export async function extractText(filePath: string): Promise<string> {
	const ext = path.extname(filePath).toLowerCase();
	if (ext === '.md') {
		return fs.readFile(filePath, 'utf-8');
	} else if (ext === '.pdf') {
		const buffer = await fs.readFile(filePath);
		const data = await new PDFParse({ data: buffer }).getText();
		return data.text;
	} else {
		throw new Error('Unsupported file type');
	}
}

