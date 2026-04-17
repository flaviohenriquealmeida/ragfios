// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import { describe, it, expect } from 'vitest';
import { XSSSanitizationGuard } from './xss-sanitization-guard';

describe(XSSSanitizationGuard.name, () => {
	const guard = new XSSSanitizationGuard();

	it('should return success and keep safe input unchanged', async () => {
		const input = 'Hello world';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toBe(input);
		expect(result.reason).toBeUndefined();
	});

	it('should sanitize script tags', async () => {
		const input = '<script>alert("xss")</script>';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).not.toContain('<script>');
		expect(result.reason).toBe('XSS sanitized');
	});

	it('should sanitize inline event handlers', async () => {
		const input = '<img src="x" onerror="alert(1)" />';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).not.toContain('onerror');
		expect(result.reason).toBe('XSS sanitized');
	});

	it('should sanitize javascript: URLs', async () => {
		const input = '<a href="javascript:alert(1)">click</a>';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).not.toContain('javascript:');
		expect(result.reason).toBe('XSS sanitized');
	});

	it('should handle empty string', async () => {
		const input = '';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toBe('');
		expect(result.reason).toBeUndefined();
	});

	it('should partially sanitize mixed content', async () => {
		const input = 'Hello <script>alert(1)</script> world';
		const result = await guard.run(input);

		expect(result.success).toBe(true);
		expect(result.data).toContain('Hello');
		expect(result.data).toContain('world');
		expect(result.data).not.toContain('<script>');
		expect(result.reason).toBe('XSS sanitized');
	});
});

