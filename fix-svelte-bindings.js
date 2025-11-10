#!/usr/bin/env node
/**
 * Script to fix Svelte 5 binding errors
 * Converts `const formData = {}` to `let formData = $state({})`
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const filesToFix = [
	'cirque-app/src/lib/components/events/sections/*.svelte',
	'cirque-app/src/routes/events/+page.svelte',
	'cirque-app/src/routes/performers/+page.svelte',
	'cirque-app/src/lib/components/performers/+page.svelte',
	'cirque-app/src/lib/components/clients/ClientsPage.svelte',
	'cirque-app/src/lib/components/contracts/+page.svelte',
	'cirque-app/src/lib/components/tasks/+page.svelte',
	'cirque-app/src/routes/agents/new/+page.svelte',
	'cirque-app/src/lib/components/agents/+page.svelte'
];

function fixFile(filePath) {
	console.log(`\nProcessing: ${filePath}`);

	const content = fs.readFileSync(filePath, 'utf8');

	// Pattern to match: const formData = { ... }
	// or const filterOptions = { ... }
	// or any const object that's used with bind:value

	let modified = false;
	let newContent = content;

	// Fix pattern 1: const formData = {
	if (content.includes('const formData = {')) {
		console.log('  - Found const formData pattern');
		newContent = newContent.replace(
			/(\s+)\/\/ Form state\s+const formData = \{/g,
			'$1// Form state - must use $state for bind:value to work in Svelte 5\n$1let formData = $state({'
		);
		// If no comment, just replace
		if (!newContent.includes('let formData = $state(')) {
			newContent = newContent.replace(
				/(\s+)const formData = \{/g,
				'$1let formData = $state({'
			);
		}
		modified = true;
	}

	// Fix pattern 2: const searchQuery = ''
	if (content.match(/const (searchQuery|filterText|searchTerm) = ['"]/)) {
		console.log('  - Found const search/filter pattern');
		newContent = newContent.replace(
			/const (searchQuery|filterText|searchTerm) = (['"])/g,
			'let $1 = $state($2'
		);
		modified = true;
	}

	// Fix pattern 3: const filterOptions = {
	if (content.includes('const filterOptions = {') || content.includes('const filters = {')) {
		console.log('  - Found const filterOptions/filters pattern');
		newContent = newContent.replace(
			/const (filterOptions|filters) = \{/g,
			'let $1 = $state({'
		);
		modified = true;
	}

	// Fix pattern 4: const formState = {
	if (content.includes('const formState = {')) {
		console.log('  - Found const formState pattern');
		newContent = newContent.replace(
			/const formState = \{/g,
			'let formState = $state({'
		);
		modified = true;
	}

	if (modified) {
		fs.writeFileSync(filePath, newContent, 'utf8');
		console.log('  ✓ Fixed!');
		return true;
	} else {
		console.log('  - No issues found');
		return false;
	}
}

let totalFixed = 0;

filesToFix.forEach(pattern => {
	const files = glob.sync(pattern, { cwd: __dirname });
	files.forEach(file => {
		const fullPath = path.join(__dirname, file);
		if (fs.existsSync(fullPath)) {
			if (fixFile(fullPath)) {
				totalFixed++;
			}
		}
	});
});

console.log(`\n\nTotal files fixed: ${totalFixed}`);
console.log('Done!');
