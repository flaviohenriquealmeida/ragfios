// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import fs from 'fs';
import path from 'path';

// module-level cache (shared)
const cache = new Map<string, string>();

export class PromptLoader {
	constructor(private promptDir: string) {}

	load(name: string): string {
		if (cache.has(name)) {
			return cache.get(name)!;
		}

		const filePath = path.join(this.promptDir, `${name}.md`);

		if (!fs.existsSync(filePath)) {
			throw new Error(`Prompt "${name}" not found at ${filePath}`);
		}

		const content = fs.readFileSync(filePath, 'utf-8');
		cache.set(name, content);

		return content;
	}

	static clearCache(): void {
		cache.clear();
	}
}

