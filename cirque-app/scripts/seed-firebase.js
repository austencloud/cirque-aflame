// scripts/seed-firebase.js
// Seed Firebase Firestore with sample data

import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	collection,
	addDoc,
	setDoc,
	doc,
	deleteDoc,
	getDocs
} from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration from .env
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

// Sample data
const sampleEvents = [
	{
		id: 'event-1',
		clientId: 'client-1',
		name: 'Back to School Bash',
		date: new Date('2024-08-15'),
		location: 'Pritzker Elementary School',
		status: 'confirmed',
		performerIds: ['performer-1'],
		duration: 120,
		payment: { totalValue: 500, deposit: 200, balance: 300 },
		contract: { sent: true, received: true },
		notes: 'Annual event, very popular',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'event-2',
		clientId: 'client-2',
		name: 'Hannukah Festival',
		date: new Date('2024-12-15'),
		location: 'Agudath Jacob Community Center',
		status: 'pending',
		performerIds: ['performer-2'],
		duration: 180,
		payment: { totalValue: 750, deposit: 300, balance: 450 },
		contract: { sent: true, received: false },
		notes: 'Large event, need fire performer',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'event-3',
		clientId: 'client-3',
		name: 'Jefferson Park Block Party',
		date: new Date('2024-08-20'),
		location: 'Jefferson Park',
		status: 'confirmed',
		performerIds: ['performer-1', 'performer-3'],
		duration: 240,
		payment: { totalValue: 1000, deposit: 500, balance: 500 },
		contract: { sent: true, received: true },
		notes: 'Outdoor event, bring tent',
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

const sampleClients = [
	{
		id: 'client-1',
		name: 'Pritzker Elementary',
		contactPerson: 'Principal Jones',
		email: 'pjones@pritzker.edu',
		phone: '555-1111',
		address: '123 School St, Chicago, IL',
		eventTypes: ['School Event', 'Festival'],
		servicesUsed: ['Balloon Art', 'Juggling'],
		lastPerformed: new Date('2023-09-15'),
		lastContacted: new Date('2024-07-05'),
		nextFollowUp: {
			date: new Date('2024-08-01'),
			task: 'Confirm details for Back To School Bash'
		},
		notes: 'Loves the balloon dog act',
		status: 'active',
		events: ['event-1'],
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'client-2',
		name: 'Agudath Jacob',
		contactPerson: 'Rabbi Cohen',
		email: 'rcohen@agudathjacob.org',
		phone: '555-2222',
		address: '456 Temple Rd, Chicago, IL',
		eventTypes: ['Religious Event', 'Festival'],
		servicesUsed: ['Fire Performance', 'Juggling'],
		lastPerformed: new Date('2023-12-10'),
		lastContacted: new Date('2024-07-01'),
		nextFollowUp: { date: new Date('2024-07-14'), task: 'Regarding Hannukah planning' },
		notes: 'Prefers family-friendly acts',
		status: 'active',
		events: ['event-2'],
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'client-3',
		name: 'Jefferson Park Association',
		contactPerson: 'Sarah Miller',
		email: 'smiller@jeffpark.org',
		phone: '555-3333',
		address: '789 Park Ave, Chicago, IL',
		eventTypes: ['Community Event', 'Festival'],
		servicesUsed: ['Balloon Art', 'Stilt Walking', 'Fire Performance'],
		lastPerformed: new Date('2023-08-15'),
		lastContacted: new Date('2024-06-20'),
		nextFollowUp: { date: new Date('2024-08-01'), task: 'Confirm performers' },
		notes: 'Annual summer event, great crowd',
		status: 'active',
		events: ['event-3'],
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

const samplePerformers = [
	{
		id: 'performer-1',
		name: 'Bozo the Amazing',
		email: 'bozo@performers.com',
		phone: '555-7777',
		skills: ['Balloon Art', 'Juggling', 'Magic'],
		category: 'Clown',
		experience: 5,
		rate: 150,
		availability: {
			monday: true,
			tuesday: true,
			wednesday: true,
			thursday: true,
			friday: true,
			saturday: true,
			sunday: true
		},
		notes: 'Very reliable, great with kids',
		status: 'active',
		events: ['event-1', 'event-3'],
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'performer-2',
		name: 'Pyro Pete',
		email: 'pete@fireshow.com',
		phone: '555-8888',
		skills: ['Fire Performance', 'Fire Eating', 'Fire Breathing'],
		category: 'Fire Performer',
		experience: 8,
		rate: 250,
		availability: {
			monday: false,
			tuesday: false,
			wednesday: true,
			thursday: true,
			friday: true,
			saturday: true,
			sunday: true
		},
		notes: 'Experienced, has own insurance',
		status: 'active',
		events: ['event-2'],
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'performer-3',
		name: 'Stella Stilts',
		email: 'stella@stiltwalker.com',
		phone: '555-9999',
		skills: ['Stilt Walking', 'Face Painting', 'Balloon Art'],
		category: 'Stilt Walker',
		experience: 3,
		rate: 175,
		availability: {
			monday: true,
			tuesday: true,
			wednesday: false,
			thursday: false,
			friday: true,
			saturday: true,
			sunday: true
		},
		notes: 'Great personality, crowd favorite',
		status: 'active',
		events: ['event-3'],
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

async function clearCollection(collectionName) {
	console.log(`Clearing ${collectionName}...`);
	const snapshot = await getDocs(collection(db, collectionName));
	const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
	await Promise.all(deletePromises);
	console.log(`✓ Cleared ${snapshot.size} documents from ${collectionName}`);
}

async function seedCollection(collectionName, data) {
	console.log(`Seeding ${collectionName}...`);
	for (const item of data) {
		const { id, ...itemData } = item;
		await setDoc(doc(db, collectionName, id), itemData);
	}
	console.log(`✓ Added ${data.length} documents to ${collectionName}`);
}

async function seed() {
	try {
		console.log('🌱 Starting Firebase seed...\n');

		// Clear existing data
		await clearCollection('events');
		await clearCollection('clients');
		await clearCollection('performers');

		console.log('');

		// Seed new data
		await seedCollection('events', sampleEvents);
		await seedCollection('clients', sampleClients);
		await seedCollection('performers', samplePerformers);

		console.log('\n✅ Firebase seed completed successfully!');
		console.log('\nSummary:');
		console.log(`  - ${sampleEvents.length} events`);
		console.log(`  - ${sampleClients.length} clients`);
		console.log(`  - ${samplePerformers.length} performers`);

		process.exit(0);
	} catch (error) {
		console.error('❌ Error seeding Firebase:', error);
		process.exit(1);
	}
}

seed();
