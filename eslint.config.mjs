// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'error'
		},
		ignores: ['dist/**', 'node_modules/**']
	}
];

