// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License
export interface GuardResult<T> {
	guard: string;
	success: boolean;
	reason?: string;
	data: T;
}

