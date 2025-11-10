// src/lib/types.ts
// Core data models for the CircusSync application

export interface Client {
	id: string;
	name: string;
	contactPerson: string;
	email: string;
	phone: string;
	address: string;
	eventTypes: string[];
	servicesUsed: string[];
	lastPerformed: Date | null;
	lastContacted: Date | null;
	nextFollowUp: {
		date: Date | null;
		task: string;
	};
	notes: string;
	status: 'active' | 'inactive' | 'lead' | 'yearly';
	events: string[]; // references to events
	createdAt: Date;
	updatedAt: Date;
}

export type PerformerSkillCategory =
	| 'fire'
	| 'balloon'
	| 'stilt'
	| 'juggle'
	| 'aerial'
	| 'magic'
	| 'other';
export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type AvailabilityStatus = 'available' | 'unavailable' | 'tentative';
export type EventStatus = 'inquiry' | 'confirmed' | 'deposit-received' | 'completed' | 'cancelled';
export type ContactMethod = 'email' | 'phone' | 'text';
export type ClientStatus = 'active' | 'inactive' | 'lead' | 'yearly';
export interface Event {
	target: HTMLInputElement;
	id: string;
	name: string;
	date: Date;
	client: string; // reference to client
	location: {
		address: string;
		notes?: string;
		mapLink?: string;
	};
	status: EventStatus; // Use the defined type here
	performers: {
		performer: string; // reference to performer
		displayName?: string; // Add this if you want to store the name at the time of adding
		role: string;
		pay: number;
		confirmed: boolean;
	}[];
	// ... rest of Event interface
}

export interface Performer {
	pay: number;
	id: string;
	name: string;
	email: string;
	phone: string;
	address?: string;
	profilePhoto?: string;
	skills: {
		category: PerformerSkillCategory;
		props: string[];
		acts: string[];
		level: SkillLevel;
	}[];
	availability: {
		date: Date;
		status: AvailabilityStatus;
		notes?: string;
	}[];
	events: string[]; // references to events
	notes: string;
	payRate: {
		category: string;
		rate: number;
		unit: 'hourly' | 'per-event' | 'per-day';
	}[];
	documents?: {
		type: 'contract' | 'insurance' | 'certification' | 'other';
		name: string;
		url: string;
		expiryDate?: Date;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Event {
	id: string;
	name: string;
	date: Date;
	client: string; // reference to client
	location: {
		address: string;
		notes?: string;
		mapLink?: string;
	};
	status: EventStatus;
	performers: {
		performer: string; // reference to performer
		displayName?: string; // Optional display name
		role: string;
		pay: number;
		confirmed: boolean;
	}[];
	services: string[];
	performanceTime: {
		start: string;
		end: string;
	};
	callTime: string;
	costume: string;
	equipmentNeeded: string[];
	contract: {
		sent: boolean;
		sentDate?: Date;
		received: boolean;
		receivedDate?: Date;
		url?: string;
	};
	deposit: {
		required: boolean;
		amount?: number;
		received: boolean;
		receivedDate?: Date;
	};
	payment: {
		totalValue: number;
		paid: boolean;
		paidDate?: Date;
		method?: 'check' | 'cash' | 'transfer' | 'credit-card';
	};
	notes: string;
	clientLiaison: string;
	gigManager: string;
	createdAt: Date;
	updatedAt: Date;
	recurring?: {
		type: 'weekly' | 'monthly' | 'yearly';
		endDate: Date;
	};
}

export interface Agent {
	id: string;
	name: string;
	agency: string;
	email: string;
	phone: string;
	preferredContactMethod: ContactMethod;
	specialization: string[];
	opportunitiesSent: {
		date: Date;
		description: string;
		status: 'pending' | 'accepted' | 'rejected';
		value?: number;
	}[];
	partnershipStartDate: Date | null;
	paymentTerms: string;
	commissionRate?: number;
	notes: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notification {
	id: string;
	type: 'reminder' | 'alert' | 'info';
	title: string;
	message: string;
	linkTo?: string;
	read: boolean;
	createdAt: Date;
	expiresAt?: Date;
}

export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay: boolean;
	status: EventStatus;
	color?: string;
	eventId: string; // reference to the full event
	performers?: string[]; // list of performer IDs
}

export interface Document {
	id: string;
	name: string;
	type: 'contract' | 'invoice' | 'rider' | 'insurance' | 'other';
	relatedTo: {
		type: 'client' | 'performer' | 'event' | 'agent';
		id: string;
	};
	url: string;
	createdAt: Date;
	expiresAt?: Date;
}

export interface Task {
	id: string;
	title: string;
	description?: string;
	dueDate: Date;
	completed: boolean;
	priority: 'low' | 'medium' | 'high';
	relatedTo?: {
		type: 'client' | 'performer' | 'event' | 'agent';
		id: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface User {
	id: string;
	email: string;
	displayName?: string;
	role: 'admin' | 'user' | 'viewer';
	createdAt: Date;
	updatedAt: Date;
}
