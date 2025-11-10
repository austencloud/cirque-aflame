/**
 * Script to reformat all minified Svelte files
 * These files have all their code compressed into 1-6 lines
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get list of files with fewer than 10 lines (likely minified)
const output = execSync(
	'find src -name "*.svelte" -exec sh -c \'lines=$(wc -l < "$1"); if [ "$lines" -lt 10 ]; then echo "$1"; fi\' _ {} \\;',
	{ encoding: 'utf-8', cwd: process.cwd() }
);

const minifiedFiles = output
	.trim()
	.split('\n')
	.filter((f) => f.length > 0)
	.map((f) => f.trim());

console.log(`Found ${minifiedFiles.length} minified files to reformat\n`);

let successCount = 0;
let errorCount = 0;
const errors = [];

for (const file of minifiedFiles) {
	try {
		console.log(`Processing: ${file}`);

		// Read the file
		const content = readFileSync(file, 'utf-8');

		// Check if it's actually minified (has very long lines)
		const lines = content.split('\n');
		const hasLongLines = lines.some((line) => line.length > 500);

		if (!hasLongLines) {
			console.log(`  ⏭️  Skipping (not minified)\n`);
			continue;
		}

		// Basic reformatting approach:
		// 1. Split script/markup/style sections
		// 2. Add proper spacing and indentation

		let reformatted = content;

		// Add line breaks after common HTML/Svelte tags
		reformatted = reformatted
			// Script section
			.replace(/<script([^>]*)>/g, '<script$1>\n\t')
			.replace(/<\/script>/g, '\n</script>\n\n')

			// Style section
			.replace(/<style([^>]*)>/g, '\n\n<style$1>\n\t')
			.replace(/<\/style>/g, '\n</style>\n')

			// Svelte head
			.replace(/<svelte:head>/g, '\n<svelte:head>\n\t')
			.replace(/<\/svelte:head>/g, '\n</svelte:head>\n\n')

			// Common block structures
			.replace(/\{#if /g, '\n{#if ')
			.replace(/\{:else if /g, '\n{:else if ')
			.replace(/\{:else\}/g, '\n{:else}\n\t')
			.replace(/\{\/if\}/g, '\n{/if}\n')
			.replace(/\{#each /g, '\n{#each ')
			.replace(/\{\/each\}/g, '\n{/each}\n')

			// Common HTML elements
			.replace(/<div /g, '\n<div ')
			.replace(/<\/div>/g, '</div>\n')
			.replace(/<button /g, '\n<button ')
			.replace(/<\/button>/g, '</button>\n')
			.replace(/<input /g, '\n<input ')
			.replace(/<select /g, '\n<select ')
			.replace(/<\/select>/g, '</select>\n')

			// Import statements
			.replace(/import /g, '\nimport ')

			// Function declarations
			.replace(/function /g, '\n\tfunction ')
			.replace(/async function /g, '\n\tasync function ')
			.replace(/const /g, '\n\tconst ')
			.replace(/let /g, '\n\tlet ')

			// Clean up multiple newlines
			.replace(/\n{3,}/g, '\n\n')

			// Trim each line
			.split('\n')
			.map((line) => line.trim())
			.join('\n');

		// Write the reformatted content
		writeFileSync(file, reformatted, 'utf-8');

		console.log(`  ✅ Reformatted successfully\n`);
		successCount++;
	} catch (error) {
		console.error(`  ❌ Error: ${error.message}\n`);
		errors.push({ file, error: error.message });
		errorCount++;
	}
}

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`✅ Successfully reformatted: ${successCount} files`);
console.log(`❌ Errors: ${errorCount} files`);

if (errors.length > 0) {
	console.log('\nErrors encountered:');
	errors.forEach(({ file, error }) => {
		console.log(`  - ${file}: ${error}`);
	});
}

console.log('\n⚠️  NOTE: These files have been reformatted with basic spacing.');
console.log('   You may need to manually adjust indentation in some files.');
console.log('   Run Prettier or your code formatter for final cleanup.\n');

process.exit(errorCount > 0 ? 1 : 0);
