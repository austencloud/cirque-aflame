/**
 * Bulk remove Tailwind classes from .svelte files
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('🔧 Bulk Tailwind Class Removal');
console.log('==============================\n');

let filesProcessed = 0;
let classesRemoved = 0;

// Tailwind class patterns to remove
const tailwindPatterns = [
	// Layout
	/\b(max-w|min-w|w)-(\w+|\d+)\b/g,
	/\b(max-h|min-h|h)-(\w+|\d+)\b/g,
	/\bmx-auto\b/g,
	/\bmy-auto\b/g,

	// Padding & Margin
	/\b(p|px|py|pt|pb|pl|pr)-\d+\b/g,
	/\b(m|mx|my|mt|mb|ml|mr)-\d+\b/g,
	/\b(space-x|space-y)-\d+\b/g,
	/\bgap-\d+\b/g,

	// Display & Flexbox
	/\b(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden)\b/g,
	/\b(flex-row|flex-col|flex-wrap|flex-nowrap)\b/g,
	/\b(items|justify|content)-(start|center|end|between|around|stretch)\b/g,
	/\bflex-\d+\b/g,

	// Grid
	/\bgrid-cols-\d+\b/g,
	/\bgrid-rows-\d+\b/g,
	/\bcol-span-\d+\b/g,

	// Colors
	/\b(bg|text|border)-(gray|red|blue|green|yellow|purple|pink|indigo|amber|cyan)-(50|100|200|300|400|500|600|700|800|900)\b/g,

	// Typography
	/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/g,
	/\bfont-(thin|light|normal|medium|semibold|bold|extrabold)\b/g,
	/\btext-(left|center|right|justify)\b/g,
	/\b(uppercase|lowercase|capitalize)\b/g,
	/\btruncate\b/g,
	/\bwhitespace-\w+\b/g,

	// Borders
	/\bborder(-\d+)?\b/g,
	/\bborder-(t|r|b|l|x|y)\b/g,
	/\brounded(-\w+)?\b/g,

	// Shadow & Effects
	/\bshadow(-\w+)?\b/g,
	/\bopacity-\d+\b/g,

	// Position
	/\b(relative|absolute|fixed|sticky)\b/g,
	/\b(inset|top|right|bottom|left)-\d+\b/g,

	// Overflow
	/\boverflow(-x|-y)?-\w+\b/g,

	// Cursor & Interaction
	/\bcursor-\w+\b/g,
	/\bpointer-events-\w+\b/g,

	// Outline & Ring (focus states)
	/\bfocus:outline-none\b/g,
	/\bfocus:ring-\d+\b/g,
	/\bfocus:ring-\w+-\d+\b/g,
	/\bfocus:border-\w+\b/g,
	/\bfocus:border-transparent\b/g,

	// Hover states
	/\bhover:(bg|text|border)-\w+-\d+\b/g,
	/\bhover:underline\b/g,

	// Responsive prefixes
	/\b(sm|md|lg|xl|2xl):[\w-]+\b/g,

	// Dark mode
	/\bdark:[\w-]+\b/g
];

function removeTailwindClasses(content) {
	let modified = content;
	let removed = 0;

	// Process each class attribute
	modified = modified.replace(/class="([^"]*)"/g, (match, classes) => {
		const originalClasses = classes;

		// Apply all patterns
		for (const pattern of tailwindPatterns) {
			classes = classes.replace(pattern, '');
		}

		// Clean up extra whitespace
		classes = classes.replace(/\s+/g, ' ').trim();

		// Count removed classes
		const originalCount = originalClasses.split(/\s+/).filter(c => c).length;
		const newCount = classes.split(/\s+/).filter(c => c).length;
		removed += (originalCount - newCount);

		// Return cleaned attribute or remove if empty
		return classes ? `class="${classes}"` : '';
	});

	// Clean up any double spaces left behind
	modified = modified.replace(/\s{2,}/g, ' ');
	// Remove empty class attributes
	modified = modified.replace(/\s*class=""\s*/g, ' ');

	classesRemoved += removed;
	return modified;
}

function processFile(filePath) {
	try {
		const content = readFileSync(filePath, 'utf8');
		const modified = removeTailwindClasses(content);

		if (content !== modified) {
			writeFileSync(filePath, modified, 'utf8');
			return true;
		}
		return false;
	} catch (error) {
		console.error(`Error processing ${filePath}:`, error.message);
		return false;
	}
}

function walkDirectory(dir) {
	const files = readdirSync(dir);

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);

		if (stat.isDirectory()) {
			// Skip node_modules
			if (file !== 'node_modules' && file !== '.svelte-kit') {
				walkDirectory(filePath);
			}
		} else if (file.endsWith('.svelte')) {
			const relativePath = filePath.replace(process.cwd() + '\\', '');
			if (processFile(filePath)) {
				console.log(`✓ ${relativePath}`);
				filesProcessed++;
			}
		}
	}
}

// Start processing
const srcPath = join(process.cwd(), 'src');
walkDirectory(srcPath);

console.log('\n==============================');
console.log(`Files modified: ${filesProcessed}`);
console.log(`Classes removed: ${classesRemoved}`);
console.log('\n⚠️  Important: Files have been stripped of Tailwind classes.');
console.log('You will need to add semantic CSS to maintain appearance.\n');
