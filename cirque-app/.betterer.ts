/**
 * Betterer configuration for incremental TypeScript strict mode migration
 * @see https://phenomnomnominal.github.io/betterer/
 */

import { typescript } from '@betterer/typescript';

export default {
	/**
	 * Track TypeScript strict mode errors and prevent regressions
	 * As you fix errors, Betterer will update the baseline and prevent new errors
	 */
	'TypeScript strict mode': () =>
		typescript('./tsconfig.strict.json', {
			strict: true
		}).include('./src/**/*.ts', './src/**/*.svelte')
};
