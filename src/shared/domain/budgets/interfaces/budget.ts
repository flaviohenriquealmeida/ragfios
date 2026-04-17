// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License
export interface Budget {
	total: number;
	input: {
		rag: number;
		history: number;
		system: number;
		user: number;
	};
	output: number;
	buffer: number;
}

