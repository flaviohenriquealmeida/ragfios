import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PromptLoader } from './prompt-loader';

vi.mock('fs');

const mockedFs = vi.mocked(fs);

describe('PromptLoader', () => {
	let loader: PromptLoader;
	const baseDir = '/fake/prompts';

	beforeEach(() => {
		vi.clearAllMocks();
		PromptLoader.clearCache();
		loader = new PromptLoader(baseDir);
	});

	it('throws if file does not exist', () => {
		mockedFs.existsSync.mockReturnValue(false);

		expect(() => loader.load('missing')).toThrowError(/Prompt "missing" not found/);

		const expectedPath = path.join(baseDir, 'missing.md');
		expect(mockedFs.existsSync).toHaveBeenCalledWith(expectedPath);
	});

	it('reads file and caches content', () => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.readFileSync.mockReturnValue('hello world');

		const result = loader.load('test');

		expect(result).toBe('hello world');

		const expectedPath = path.join(baseDir, 'test.md');
		expect(mockedFs.readFileSync).toHaveBeenCalledWith(expectedPath, 'utf-8');
		expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1);
	});

	it('returns cached value on second call', () => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.readFileSync.mockReturnValue('cached content');

		const first = loader.load('test');
		const second = loader.load('test');

		expect(first).toBe('cached content');
		expect(second).toBe('cached content');
		expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1);
	});

	it('shares cache across instances (module-level)', () => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.readFileSync.mockReturnValue('shared');

		const loaderA = new PromptLoader(baseDir);
		const loaderB = new PromptLoader(baseDir);

		loaderA.load('test');
		loaderB.load('test');

		expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1);
	});

	it('clearCache resets shared cache', () => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.readFileSync.mockReturnValue('value');

		loader.load('test');

		PromptLoader.clearCache();

		loader.load('test');

		expect(mockedFs.readFileSync).toHaveBeenCalledTimes(2);
	});

	it('builds correct file path', () => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.readFileSync.mockReturnValue('content');

		loader.load('myPrompt');

		const expectedPath = path.join(baseDir, 'myPrompt.md');

		expect(mockedFs.existsSync).toHaveBeenCalledWith(expectedPath);
		expect(mockedFs.readFileSync).toHaveBeenCalledWith(expectedPath, 'utf-8');
	});
});

