// scripts/import-natural-language-ai.js
// AI-powered natural language data import to Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
	apiKey: process.env.VITE_FIREBASE_API_KEY,
	authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Parse natural language using OpenAI API
 */
async function parseNaturalLanguage(input) {
	console.log('🤖 Using AI to parse your input...\n');

	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		console.error('❌ OPENAI_API_KEY not found in environment variables');
		console.log('\nPlease set your OpenAI API key:');
		console.log('  In bash: export OPENAI_API_KEY="your-key-here"');
		console.log('  Or add it to your .env file\n');
		process.exit(1);
	}

	const systemPrompt = `You are a data extraction assistant for a circus/entertainment business management system. Extract structured data from natural language descriptions.

Return ONLY valid JSON with this exact structure:
{
  "clients": [{
    "type": "organization" | "individual",
    "name": "string",
    "email": "string" | null,
    "phone": "string" | null,
    "address": "string" | null,
    "notes": "string"
  }],
  "performers": [{
    "name": "string",
    "email": "string" | null,
    "phone": "string" | null,
    "skills": ["string"],
    "rate": number | null,
    "availability": "available" | "busy" | "unavailable",
    "notes": "string"
  }],
  "agents": [{
    "name": "string",
    "email": "string" | null,
    "phone": "string" | null,
    "commission": number,
    "notes": "string"
  }],
  "events": [{
    "title": "string",
    "type": "string",
    "date": "ISO 8601 date string",
    "location": "string",
    "fee": number,
    "clientName": "string (name of client)",
    "performerNames": ["string (names of performers)"],
    "status": "draft" | "confirmed" | "completed" | "cancelled",
    "notes": "string"
  }],
  "contracts": [{
    "clientName": "string",
    "performerNames": ["string"],
    "startDate": "ISO 8601 date string",
    "endDate": "ISO 8601 date string" | null,
    "fee": number,
    "terms": "string",
    "status": "draft" | "signed" | "completed" | "cancelled"
  }]
}

Rules:
- All arrays can be empty if that entity type isn't mentioned
- Use null for missing optional fields
- Convert all dates to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DD)
- Extract monetary amounts as numbers without currency symbols
- For events/contracts, use the actual names of clients/performers mentioned (we'll link them later)
- Infer reasonable defaults when needed (e.g., if someone performed but no rate mentioned, rate can be null)
- If unclear whether something is a client or performer, use context clues (paid money = client, performed = performer)
- Return ONLY the JSON, no markdown formatting, no explanations`;

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: input }
				],
				temperature: 0.1,
				response_format: { type: 'json_object' }
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`OpenAI API error: ${response.status} - ${error}`);
		}

		const data = await response.json();
		const parsed = JSON.parse(data.choices[0].message.content);

		console.log('✅ Successfully parsed input\n');
		return parsed;
	} catch (error) {
		console.error('❌ Error parsing with AI:', error.message);
		throw error;
	}
}

/**
 * Create entity with proper structure and IDs
 */
function createEntity(type, data) {
	const now = new Date().toISOString();
	const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

	switch (type) {
		case 'client':
			return {
				id,
				type: data.type || 'organization',
				name: data.name || 'Unknown Client',
				email: data.email || null,
				phone: data.phone || null,
				address: data.address || null,
				notes: data.notes || '',
				createdAt: now,
				updatedAt: now
			};

		case 'performer':
			return {
				id,
				name: data.name || 'Unknown Performer',
				email: data.email || null,
				phone: data.phone || null,
				skills: Array.isArray(data.skills) ? data.skills : [],
				rate: data.rate || null,
				availability: data.availability || 'available',
				notes: data.notes || '',
				createdAt: now,
				updatedAt: now
			};

		case 'agent':
			return {
				id,
				name: data.name || 'Unknown Agent',
				email: data.email || null,
				phone: data.phone || null,
				commission: data.commission || 15,
				notes: data.notes || '',
				createdAt: now,
				updatedAt: now
			};

		case 'event':
			return {
				id,
				title: data.title || 'Untitled Event',
				type: data.type || 'performance',
				date: data.date || now,
				location: data.location || '',
				fee: data.fee || 0,
				clientId: null,
				performerIds: [],
				status: data.status || 'completed',
				notes: data.notes || '',
				createdAt: now,
				updatedAt: now,
				_clientName: data.clientName,
				_performerNames: data.performerNames || []
			};

		case 'contract':
			return {
				id,
				clientId: null,
				performerIds: [],
				startDate: data.startDate || now,
				endDate: data.endDate || null,
				fee: data.fee || 0,
				terms: data.terms || '',
				status: data.status || 'draft',
				createdAt: now,
				updatedAt: now,
				_clientName: data.clientName,
				_performerNames: data.performerNames || []
			};

		default:
			return data;
	}
}

/**
 * Write entities to Firebase with relationship resolution
 */
async function writeToFirebase(entities) {
	let totalWritten = 0;

	// Maps to track created entities by name (case-insensitive)
	const clientsByName = new Map();
	const performersByName = new Map();

	// Helper to normalize names for lookup
	const normalizeName = (name) => name?.toLowerCase().trim();

	// Step 1: Create clients
	if (entities.clients?.length > 0) {
		console.log(`\n📝 Writing ${entities.clients.length} clients...`);
		for (const item of entities.clients) {
			try {
				const entity = createEntity('client', item);
				const docRef = doc(db, 'clients', entity.id);
				await setDoc(docRef, entity);
				console.log(`  ✅ ${entity.name}`);
				clientsByName.set(normalizeName(entity.name), entity.id);
				totalWritten++;
			} catch (error) {
				console.error(`  ❌ Failed to add ${item.name}:`, error.message);
			}
		}
	}

	// Step 2: Create performers
	if (entities.performers?.length > 0) {
		console.log(`\n📝 Writing ${entities.performers.length} performers...`);
		for (const item of entities.performers) {
			try {
				const entity = createEntity('performer', item);
				const docRef = doc(db, 'performers', entity.id);
				await setDoc(docRef, entity);
				console.log(
					`  ✅ ${entity.name} ${
						entity.skills.length > 0 ? '(' + entity.skills.join(', ') + ')' : ''
					}`
				);
				performersByName.set(normalizeName(entity.name), entity.id);
				totalWritten++;
			} catch (error) {
				console.error(`  ❌ Failed to add ${item.name}:`, error.message);
			}
		}
	}

	// Step 3: Create agents
	if (entities.agents?.length > 0) {
		console.log(`\n📝 Writing ${entities.agents.length} agents...`);
		for (const item of entities.agents) {
			try {
				const entity = createEntity('agent', item);
				const docRef = doc(db, 'agents', entity.id);
				await setDoc(docRef, entity);
				console.log(`  ✅ ${entity.name}`);
				totalWritten++;
			} catch (error) {
				console.error(`  ❌ Failed to add ${item.name}:`, error.message);
			}
		}
	}

	// Step 4: Create events (with relationship linking)
	if (entities.events?.length > 0) {
		console.log(`\n📝 Writing ${entities.events.length} events...`);
		for (const item of entities.events) {
			try {
				const entity = createEntity('event', item);

				// Resolve client reference
				if (entity._clientName) {
					const clientId = clientsByName.get(normalizeName(entity._clientName));
					if (clientId) {
						entity.clientId = clientId;
					} else {
						console.log(
							`  ⚠️  Client "${entity._clientName}" not found for event "${entity.title}"`
						);
					}
				}

				// Resolve performer references
				if (entity._performerNames?.length > 0) {
					entity.performerIds = entity._performerNames
						.map((name) => {
							const id = performersByName.get(normalizeName(name));
							if (!id) {
								console.log(`  ⚠️  Performer "${name}" not found for event "${entity.title}"`);
							}
							return id;
						})
						.filter(Boolean);
				}

				// Clean up temporary fields
				delete entity._clientName;
				delete entity._performerNames;

				const docRef = doc(db, 'events', entity.id);
				await setDoc(docRef, entity);
				console.log(`  ✅ ${entity.title} (${new Date(entity.date).toLocaleDateString()})`);
				totalWritten++;
			} catch (error) {
				console.error(`  ❌ Failed to add event ${item.title}:`, error.message);
			}
		}
	}

	// Step 5: Create contracts (with relationship linking)
	if (entities.contracts?.length > 0) {
		console.log(`\n📝 Writing ${entities.contracts.length} contracts...`);
		for (const item of entities.contracts) {
			try {
				const entity = createEntity('contract', item);

				// Resolve client reference
				if (entity._clientName) {
					const clientId = clientsByName.get(normalizeName(entity._clientName));
					if (clientId) {
						entity.clientId = clientId;
					} else {
						console.log(`  ⚠️  Client "${entity._clientName}" not found for contract`);
					}
				}

				// Resolve performer references
				if (entity._performerNames?.length > 0) {
					entity.performerIds = entity._performerNames
						.map((name) => {
							const id = performersByName.get(normalizeName(name));
							if (!id) {
								console.log(`  ⚠️  Performer "${name}" not found for contract`);
							}
							return id;
						})
						.filter(Boolean);
				}

				// Clean up temporary fields
				delete entity._clientName;
				delete entity._performerNames;

				const docRef = doc(db, 'contracts', entity.id);
				await setDoc(docRef, entity);
				console.log(`  ✅ Contract (${entity.status})`);
				totalWritten++;
			} catch (error) {
				console.error(`  ❌ Failed to add contract:`, error.message);
			}
		}
	}

	return totalWritten;
}

/**
 * Main interactive loop
 */
async function main() {
	console.log('🎪 AI-Powered Natural Language Firebase Importer');
	console.log('=================================================\n');
	console.log('Just describe your clients, performers, events, etc. in plain English!');
	console.log('The AI will understand and structure everything automatically.\n');
	console.log('📝 Tips:');
	console.log('  - Mention names, emails, phone numbers when you know them');
	console.log('  - Describe what they do (skills, acts, etc.)');
	console.log('  - Include dates, fees, locations for events');
	console.log('  - Just type naturally - no special format needed!\n');
	console.log('Type "done" on a new line when finished, or Ctrl+C to exit.\n');
	console.log('Example input:');
	console.log('─────────────────────────────────────────────────');
	console.log('I worked with Jefferson Park District back in summer 2023.');
	console.log('The main contact was Sarah Martinez, her email is');
	console.log('sarah@jpd.org and phone is 555-1234. We did this huge');
	console.log('festival on July 15th at their main park and they paid');
	console.log('$800. I had John Smith do fire dancing and Maria Garcia');
	console.log('performed aerial silks. Both were amazing!');
	console.log('─────────────────────────────────────────────────\n');

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	let inputBuffer = '';

	rl.on('line', (line) => {
		if (line.trim().toLowerCase() === 'done') {
			rl.close();
		} else {
			inputBuffer += line + '\n';
		}
	});

	rl.on('close', async () => {
		if (!inputBuffer.trim()) {
			console.log('\n👋 No input provided. Exiting.');
			process.exit(0);
		}

		console.log('\n' + '='.repeat(50));

		try {
			// Parse with AI
			const entities = await parseNaturalLanguage(inputBuffer);

			// Show what was parsed
			console.log('📊 Parsed Data Summary:');
			console.log('─────────────────────────');
			console.log(`  Clients: ${entities.clients?.length || 0}`);
			console.log(`  Performers: ${entities.performers?.length || 0}`);
			console.log(`  Agents: ${entities.agents?.length || 0}`);
			console.log(`  Events: ${entities.events?.length || 0}`);
			console.log(`  Contracts: ${entities.contracts?.length || 0}`);

			const hasData =
				entities.clients?.length > 0 ||
				entities.performers?.length > 0 ||
				entities.agents?.length > 0 ||
				entities.events?.length > 0 ||
				entities.contracts?.length > 0;

			if (!hasData) {
				console.log('\n⚠️  No entities detected. Please try with more specific details.');
				process.exit(0);
			}

			// Show detailed preview
			console.log('\n📋 Preview of what will be added:');
			console.log('─────────────────────────');

			if (entities.clients?.length > 0) {
				console.log('\n👥 Clients:');
				entities.clients.forEach((c) =>
					console.log(`  • ${c.name}${c.email ? ' (' + c.email + ')' : ''}`)
				);
			}

			if (entities.performers?.length > 0) {
				console.log('\n🎭 Performers:');
				entities.performers.forEach((p) =>
					console.log(`  • ${p.name}${p.skills?.length > 0 ? ' - ' + p.skills.join(', ') : ''}`)
				);
			}

			if (entities.agents?.length > 0) {
				console.log('\n💼 Agents:');
				entities.agents.forEach((a) => console.log(`  • ${a.name} (${a.commission}% commission)`));
			}

			if (entities.events?.length > 0) {
				console.log('\n🎪 Events:');
				entities.events.forEach((e) => {
					const date = new Date(e.date);
					console.log(
						`  • ${e.title} - ${date.toLocaleDateString()} ${e.location ? 'at ' + e.location : ''}`
					);
				});
			}

			if (entities.contracts?.length > 0) {
				console.log('\n📄 Contracts:');
				entities.contracts.forEach((c) =>
					console.log(`  • ${c.clientName || 'Unknown'} - ${c.status}`)
				);
			}

			// Write to Firebase
			console.log('\n' + '='.repeat(50));
			console.log('🔄 Writing to Firebase...\n');

			const totalWritten = await writeToFirebase(entities);

			console.log('\n' + '='.repeat(50));
			console.log(`✅ Success! Wrote ${totalWritten} entities to Firebase!`);
			console.log('\nYou can now view them in your app or Firebase console.');
			console.log('🔗 Firebase Console: https://console.firebase.google.com/\n');
		} catch (error) {
			console.error('\n❌ Error:', error.message);
			if (error.stack) {
				console.error('\nStack trace:', error.stack);
			}
			process.exit(1);
		}

		process.exit(0);
	});
}

// Run the script
main().catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});
