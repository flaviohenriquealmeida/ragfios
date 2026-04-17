import { describe, it, expect, beforeEach, vi } from 'vitest';

import { MyLogger } from '../../../../../../shared/ports/my-logger/my-logger';
import { ProseStreamRefiner } from './prose-stream-refiner';

describe('ProseStreamRefiner', () => {
	let mockLogger: MyLogger;
	let refiner: ProseStreamRefiner;
	const conversationId = 'test-conv-123';

	beforeEach(() => {
		// Setup a mock logger
		mockLogger = {
			warn: vi.fn(),
			info: vi.fn(),
			error: vi.fn(),
			debug: vi.fn()
		} as unknown as MyLogger;

		refiner = new ProseStreamRefiner(mockLogger);
	});

	it('should buffer chunks and return null until the header is finalized', () => {
		const result = refiner.handleDelta('[NOT_FO', conversationId);
		expect(result).toBeNull();
		expect(refiner.isReleased()).toBe(false);
	});

	it('should strip [NOT_FOUND] tag and log a warning when detected', () => {
		// First chunk
		refiner.handleDelta('[NOT_FOUND]', conversationId);

		// Second chunk triggers finalization (via space detection or length)
		const result = refiner.handleDelta(' Hello world', conversationId);

		expect(result).toBe('Hello world');
		expect(mockLogger.warn).toHaveBeenCalledWith(
			expect.stringContaining('[NOT_FOUND] RAG Information missing')
		);
		expect(refiner.isReleased()).toBe(true);
	});

	it('should handle multiple tags and leading whitespace', () => {
		refiner.handleDelta('  [LOG_ONLY] [NOT_FOUND] ', conversationId);
		const result = refiner.handleDelta('\nActual content starts here', conversationId);

		// The regex should strip all leading tags and whitespace
		expect(result).toBe('Actual content starts here');
		expect(mockLogger.warn).toHaveBeenCalled();
	});

	it('should act as a pass-through once released', () => {
		// Release it
		refiner.handleDelta('Just some normal text\n', conversationId);

		// Subsequent calls should return delta immediately
		const delta = 'Direct pass through';
		const result = refiner.handleDelta(delta, conversationId);

		expect(result).toBe(delta);
	});

	it('should finalize based on buffer length limit (40 chars)', () => {
		const longGarbage = 'This is a very long string without any tags at all';
		const result = refiner.handleDelta(longGarbage, conversationId);

		// Since it exceeds 40 chars, it should return the cleaned buffer immediately
		expect(result).toBe(longGarbage);
		expect(refiner.isReleased()).toBe(true);
	});

	it('should not log a warning if [NOT_FOUND] is absent', () => {
		refiner.handleDelta('[OTHER_TAG] Content', conversationId);
		refiner.handleDelta('\n', conversationId);

		expect(mockLogger.warn).not.toHaveBeenCalled();
	});
});
