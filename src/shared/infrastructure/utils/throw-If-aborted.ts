export const throwIfAborted = (signal?: AbortSignal): void => {
	if (signal?.aborted) {
		const error = new Error('Operation cancelled by user');
		error.name = 'AbortError';
		throw error;
	}
};

