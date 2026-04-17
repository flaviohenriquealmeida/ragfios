import { describe, it, expect } from 'vitest';
import { throwIfAborted } from './throw-If-aborted';

describe('throwIfAborted', () => {
	it('does nothing if no signal is provided', () => {
		expect(() => throwIfAborted()).not.toThrow();
	});

	it('does nothing if signal is not aborted', () => {
		const controller = new AbortController();

		expect(() => throwIfAborted(controller.signal)).not.toThrow();
	});

	it('throws AbortError if signal is aborted', () => {
		const controller = new AbortController();
		controller.abort();

		expect(() => throwIfAborted(controller.signal)).toThrowError('Operation cancelled by user');
	});

	it('throws error with name "AbortError"', () => {
		const controller = new AbortController();
		controller.abort();

		try {
			throwIfAborted(controller.signal);
		} catch (err: unknown) {
			const myErr = err as { name: string; message: string };
			expect(myErr).toBeInstanceOf(Error);
			expect(myErr.name).toBe('AbortError');
			expect(myErr.message).toBe('Operation cancelled by user');
		}
	});
});

