module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended', 'prettier', 'plugin:storybook/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			rules: {
				// Svelte 5 specific rules
				'svelte/valid-compile': 'error',
				'svelte/no-at-html-tags': 'warn',
				'svelte/no-unused-svelte-ignore': 'warn',
				'svelte/require-store-reactive-access': 'off', // Not needed with runes
				'svelte/no-reactive-reassign': 'off' // Not applicable with runes
			}
		},
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_'
					}
				],
				'@typescript-eslint/no-explicit-any': 'warn',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/ban-ts-comment': 'warn'
			}
		}
	],
	rules: {
		// General best practices
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'no-debugger': 'warn',
		'no-unused-vars': 'off', // Use TypeScript's version
		'prefer-const': 'warn',
		'no-var': 'error',
		eqeqeq: ['error', 'always', { null: 'ignore' }],
		curly: ['error', 'all'],
		'no-throw-literal': 'error',
		'no-return-await': 'error'
	},
	ignorePatterns: [
		'*.cjs',
		'.svelte-kit/**',
		'build/**',
		'dist/**',
		'node_modules/**',
		'coverage/**',
		'playwright-report/**',
		'test-results/**'
	]
};
