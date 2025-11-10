// src/lib/services/database.ts
import {
	collection,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	getDoc,
	query,
	where,
	orderBy,
	limit,
	Timestamp,
	serverTimestamp,
	type DocumentData,
	type QuerySnapshot,
	type DocumentSnapshot
} from 'firebase/firestore';
import type {
	Client,
	Performer,
	Event,
	Agent,
	User,
	Notification,
	Document as AppDocument, // Rename Document to avoid conflict with DOM Document
	Task,
	EventStatus,
	PerformerSkillCategory
} from '../types';
import { browser } from '$app/environment'; // Import browser check
import { getDbInstance } from '$lib/firebase'; // Import getter function

// --- Data Conversion Helpers --- (Keep these as they were)
function prepareForFirestore<T>(data: T): any {
	if (data === null || data === undefined) {
		return data;
	}
	if (data instanceof Date) {
		return Timestamp.fromDate(data);
	}
	if (Array.isArray(data)) {
		return data.map((item) => prepareForFirestore(item));
	}
	if (typeof data === 'object' && data.constructor === Object) {
		const prepared = {} as any;
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				prepared[key] = prepareForFirestore(data[key]);
			}
		}
		return prepared;
	}
	return data;
}

function convertFromFirestore<T>(data: DocumentData | undefined | null): T | null {
	if (!data) {
		return null;
	}
	const converted = { ...data } as any;
	for (const key in converted) {
		if (Object.prototype.hasOwnProperty.call(converted, key)) {
			const value = converted[key];
			if (value instanceof Timestamp) {
				converted[key] = value.toDate();
			} else if (Array.isArray(value)) {
				converted[key] = value.map((item) => convertFromFirestore(item));
			} else if (value && typeof value === 'object' && !(value instanceof Date)) {
				if (value.constructor === Object) {
					// Recurse only for plain objects
					converted[key] = convertFromFirestore(value);
				}
			}
		}
	}
	return converted as T;
}

// --- Generic CRUD Operations (Now just helpers used by services) ---
// These assume db instance is valid, checked by the calling service method

async function _addDocument<T extends { id?: string }>(
	collectionName: string,
	data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
	const db = getDbInstance(); // Still get instance here for safety, though caller should check
	if (!db) {
		throw new Error(`Database not available (_addDocument on ${collectionName})`);
	}
	const collectionRef = collection(db, collectionName);
	const preparedData = prepareForFirestore({
		...data,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
	const docRef = await addDoc(collectionRef, preparedData);
	return docRef.id;
}

async function _updateDocument<T>(
	collectionName: string,
	id: string,
	data: Partial<Omit<T, 'id' | 'createdAt'>>
): Promise<void> {
	const db = getDbInstance();
	if (!db) {
		throw new Error(`Database not available (_updateDocument on ${collectionName})`);
	}
	const docRef = doc(db, collectionName, id);
	const preparedData = prepareForFirestore({
		...data,
		updatedAt: serverTimestamp()
	});
	Object.keys(preparedData).forEach(
		(key) => preparedData[key] === undefined && delete preparedData[key]
	);
	await updateDoc(docRef, preparedData);
}

async function _deleteDocument(collectionName: string, id: string): Promise<void> {
	const db = getDbInstance();
	if (!db) {
		throw new Error(`Database not available (_deleteDocument on ${collectionName})`);
	}
	const docRef = doc(db, collectionName, id);
	await deleteDoc(docRef);
}

async function _getDocument<T extends { id: string }>(
	collectionName: string,
	id: string
): Promise<T | null> {
	const db = getDbInstance();
	if (!db) {
		return null;
	} // Return null on server
	const docRef = doc(db, collectionName, id);
	const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
	if (!docSnap.exists()) {
		return null;
	}
	const data = convertFromFirestore<Omit<T, 'id'>>(docSnap.data());
	if (!data) {
		return null;
	}
	return { ...data, id: docSnap.id } as T;
}

async function _getAllDocuments<T extends { id: string }>(collectionName: string): Promise<T[]> {
	const db = getDbInstance();
	if (!db) {
		return [];
	} // Return empty array on server
	const collectionRef = collection(db, collectionName);
	const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collectionRef);
	return querySnapshot.docs
		.map((doc) => {
			const data = convertFromFirestore<Omit<T, 'id'>>(doc.data());
			return { ...(data as object), id: doc.id } as T;
		})
		.filter((item) => item !== null) as T[];
}

// --- Specific Service Implementations (SSR Guarded at entry) ---

export const clientService = {
	async add(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			return await _addDocument<Client>('clients', client);
		} catch (e) {
			console.error('clientService.add failed:', e);
			throw e;
		}
	},
	async update(id: string, client: Partial<Client>): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _updateDocument<Client>('clients', id, client);
		} catch (e) {
			console.error('clientService.update failed:', e);
			throw e;
		}
	},
	async delete(id: string): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _deleteDocument('clients', id);
		} catch (e) {
			console.error('clientService.delete failed:', e);
			throw e;
		}
	},
	async get(id: string): Promise<Client | null> {
		try {
			return await _getDocument<Client>('clients', id);
		} catch (e) {
			// Handles browser check internally
			console.error('clientService.get failed:', e);
			return null;
		}
	},
	async getAll(): Promise<Client[]> {
		try {
			return await _getAllDocuments<Client>('clients');
		} catch (e) {
			// Handles browser check internally
			console.error('clientService.getAll failed:', e);
			return [];
		}
	},
	async getByStatus(status: Client['status']): Promise<Client[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const q = query(collection(db, 'clients'), where('status', '==', status), orderBy('name'));
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Client)
			);
		} catch (e) {
			console.error(`Error getting clients by status ${status}:`, e);
			return [];
		}
	},
	async getForFollowUp(days: number = 7): Promise<Client[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const futureDate = new Date();
			futureDate.setDate(today.getDate() + days);
			futureDate.setHours(23, 59, 59, 999);
			const q = query(
				collection(db, 'clients'),
				where('nextFollowUp.date', '>=', Timestamp.fromDate(today)),
				where('nextFollowUp.date', '<=', Timestamp.fromDate(futureDate)),
				orderBy('nextFollowUp.date')
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Client)
			);
		} catch (e) {
			console.error(`Error getting follow-up clients:`, e);
			return [];
		}
	},
	async search(searchTerm: string): Promise<Client[]> {
		// Still client-side search for simplicity
		const allClients = await this.getAll();
		if (!searchTerm) {
			return allClients;
		}
		const searchTermLower = searchTerm.toLowerCase();
		return allClients.filter(
			(client) =>
				(client.name && client.name.toLowerCase().includes(searchTermLower)) ||
				(client.contactPerson && client.contactPerson.toLowerCase().includes(searchTermLower)) ||
				(client.email && client.email.toLowerCase().includes(searchTermLower))
		);
	}
};

export const performerService = {
	async add(performer: Omit<Performer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			return await _addDocument<Performer>('performers', performer);
		} catch (e) {
			console.error('performerService.add failed:', e);
			throw e;
		}
	},
	async update(id: string, performer: Partial<Performer>): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _updateDocument<Performer>('performers', id, performer);
		} catch (e) {
			console.error('performerService.update failed:', e);
			throw e;
		}
	},
	async delete(id: string): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _deleteDocument('performers', id);
		} catch (e) {
			console.error('performerService.delete failed:', e);
			throw e;
		}
	},
	async get(id: string): Promise<Performer | null> {
		try {
			return await _getDocument<Performer>('performers', id);
		} catch (e) {
			console.error('performerService.get failed:', e);
			return null;
		}
	},
	async getAll(): Promise<Performer[]> {
		try {
			return await _getAllDocuments<Performer>('performers');
		} catch (e) {
			console.error('performerService.getAll failed:', e);
			return [];
		}
	},
	async getBySkill(category: PerformerSkillCategory): Promise<Performer[]> {
		// Client-side filtering
		try {
			const allPerformers = await this.getAll();
			return allPerformers.filter((p) => p.skills?.some((skill) => skill.category === category));
		} catch (e) {
			console.error(`Error getting performers by skill ${category}:`, e);
			return [];
		}
	},
	async getAvailableForDate(date: Date): Promise<Performer[]> {
		// Client-side filtering
		try {
			const allPerformers = await this.getAll();
			const targetDateString = date.toDateString();
			return allPerformers.filter((performer) => {
				if (!performer.availability || performer.availability.length === 0) {
					return true;
				} // Assume available
				const availabilityForDate = performer.availability.find(
					(avail) => avail.date instanceof Date && avail.date.toDateString() === targetDateString
				);
				return (
					!availabilityForDate ||
					availabilityForDate.status === 'available' ||
					availabilityForDate.status === 'tentative'
				);
			});
		} catch (e) {
			console.error(`Error getting available performers:`, e);
			return [];
		}
	}
};

export const eventService = {
	async add(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			return await _addDocument<Event>('events', event);
		} catch (e) {
			console.error('eventService.add failed:', e);
			throw e;
		}
	},
	async update(id: string, event: Partial<Event>): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _updateDocument<Event>('events', id, event);
		} catch (e) {
			console.error('eventService.update failed:', e);
			throw e;
		}
	},
	async delete(id: string): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _deleteDocument('events', id);
		} catch (e) {
			console.error('eventService.delete failed:', e);
			throw e;
		}
	},
	async get(id: string): Promise<Event | null> {
		try {
			return await _getDocument<Event>('events', id);
		} catch (e) {
			console.error('eventService.get failed:', e);
			return null;
		}
	},
	async getAll(): Promise<Event[]> {
		try {
			return await _getAllDocuments<Event>('events');
		} catch (e) {
			console.error('eventService.getAll failed:', e);
			return [];
		}
	},
	async getUpcoming(count: number = 10): Promise<Event[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const q = query(
				collection(db, 'events'),
				where('date', '>=', Timestamp.fromDate(today)),
				where('status', '!=', 'cancelled'),
				orderBy('date', 'asc'),
				limit(count)
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Event)
			);
		} catch (e) {
			console.error('Error getting upcoming events:', e);
			return [];
		}
	},
	async getByStatus(status: EventStatus): Promise<Event[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const q = query(
				collection(db, 'events'),
				where('status', '==', status),
				orderBy('date', 'desc')
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Event)
			);
		} catch (e) {
			console.error(`Error getting events by status ${status}:`, e);
			return [];
		}
	},
	async getByClient(clientId: string): Promise<Event[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const q = query(
				collection(db, 'events'),
				where('client', '==', clientId),
				orderBy('date', 'desc')
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Event)
			);
		} catch (e) {
			console.error(`Error getting events for client ${clientId}:`, e);
			return [];
		}
	},
	async getByPerformer(performerId: string): Promise<Event[]> {
		// Client-side filtering
		try {
			const allEvents = await this.getAll();
			return allEvents
				.filter((event) => event.performers?.some((p) => p.performer === performerId))
				.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
		} catch (e) {
			console.error(`Error getting events for performer ${performerId}:`, e);
			return [];
		}
	},
	async getInDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const startTimestamp = Timestamp.fromDate(startDate);
			const endTimestamp = Timestamp.fromDate(endDate);
			const q = query(
				collection(db, 'events'),
				where('date', '>=', startTimestamp),
				where('date', '<=', endTimestamp),
				orderBy('date', 'asc')
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Event)
			);
		} catch (e) {
			console.error(`Error getting events in date range:`, e);
			return [];
		}
	}
};

export const taskService = {
	async add(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			return await _addDocument<Task>('tasks', task);
		} catch (e) {
			console.error('taskService.add failed:', e);
			throw e;
		}
	},
	async update(id: string, task: Partial<Task>): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _updateDocument<Task>('tasks', id, task);
		} catch (e) {
			console.error('taskService.update failed:', e);
			throw e;
		}
	},
	async delete(id: string): Promise<void> {
		if (!browser) {
			throw new Error('Operation only available on client');
		}
		try {
			await _deleteDocument('tasks', id);
		} catch (e) {
			console.error('taskService.delete failed:', e);
			throw e;
		}
	},
	async get(id: string): Promise<Task | null> {
		try {
			return await _getDocument<Task>('tasks', id);
		} catch (e) {
			console.error('taskService.get failed:', e);
			return null;
		}
	},
	async getAll(): Promise<Task[]> {
		try {
			return await _getAllDocuments<Task>('tasks');
		} catch (e) {
			console.error('taskService.getAll failed:', e);
			return [];
		}
	},
	async getByUser(userId: string): Promise<Task[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const q = query(
				collection(db, 'tasks'),
				where('assignedTo', '==', userId),
				orderBy('dueDate', 'asc')
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Task)
			);
		} catch (e) {
			console.error(`Error getting tasks for user ${userId}:`, e);
			return [];
		}
	},
	async getUpcoming(userId: string, days: number = 7): Promise<Task[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const futureDate = new Date();
			futureDate.setDate(today.getDate() + days);
			futureDate.setHours(23, 59, 59, 999);
			const q = query(
				collection(db, 'tasks'),
				where('assignedTo', '==', userId),
				where('completed', '==', false),
				where('dueDate', '>=', Timestamp.fromDate(today)),
				where('dueDate', '<=', Timestamp.fromDate(futureDate)),
				orderBy('dueDate', 'asc')
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) => ({ ...convertFromFirestore(doc.data()), id: doc.id } as Task)
			);
		} catch (e) {
			console.error(`Error getting upcoming tasks for user ${userId}:`, e);
			return [];
		}
	}
};

// Placeholder services (implement similarly with SSR guards if needed)
export const agentService = {
	async getAll(): Promise<Agent[]> {
		return _getAllDocuments<Agent>('agents');
	},
	async get(id: string): Promise<Agent | null> {
		const db = getDbInstance();
		if (!db) {
			return null;
		}
		const docRef = doc(db, 'agents', id);
		const docSnap = await getDoc(docRef);
		return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Agent) : null;
	},
	async add(agent: Partial<Agent>): Promise<string> {
		const db = getDbInstance();
		if (!db) {
			throw new Error('Database not initialized');
		}
		const docRef = await addDoc(collection(db, 'agents'), {
			...agent,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		return docRef.id;
	},
	async update(id: string, updates: Partial<Agent>): Promise<void> {
		const db = getDbInstance();
		if (!db) {
			throw new Error('Database not initialized');
		}
		const docRef = doc(db, 'agents', id);
		await updateDoc(docRef, {
			...updates,
			updatedAt: new Date()
		});
	},
	async delete(id: string): Promise<void> {
		const db = getDbInstance();
		if (!db) {
			throw new Error('Database not initialized');
		}
		const docRef = doc(db, 'agents', id);
		await deleteDoc(docRef);
	}
};

export const notificationService = {
	async getForUser(userId: string): Promise<Notification[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		return [];
	}
};
export const documentService = {
	async getByRelatedEntity(entityType: string, entityId: string): Promise<AppDocument[]> {
		const db = getDbInstance();
		if (!db) {
			return [];
		}
		return [];
	}
};

// --- Consolidated Export ---

// Export the consolidated service object (NAMED export)
export const db_service = {
	client: clientService,
	performer: performerService,
	event: eventService,
	agent: agentService,
	task: taskService,
	notification: notificationService,
	document: documentService
};

// DO NOT add 'export default db_service;' if using named import in stores
// export default db_service;
