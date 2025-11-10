/**
 * Validation Schemas using Zod
 * Provides runtime type checking and data validation for all entities
 */

import { z } from 'zod';

// ===========================
// COMMON SCHEMAS
// ===========================

// Phone number validation (international format)
export const phoneSchema = z
	.string()
	.regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
	.optional()
	.or(z.literal(''));

// Email validation
export const emailSchema = z.string().email('Invalid email address');

// URL validation
export const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''));

// Date validation
export const dateSchema = z.coerce.date();

// Optional date that can be null
export const optionalDateSchema = z.coerce.date().nullable().optional();

// ===========================
// CLIENT SCHEMA
// ===========================

export const clientStatusSchema = z.enum(['active', 'inactive', 'lead', 'yearly']);

export const nextFollowUpSchema = z.object({
	date: optionalDateSchema,
	task: z.string().max(500, 'Task description too long')
});

export const clientSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
	contactPerson: z.string().max(255, 'Contact person name too long').optional(),
	email: emailSchema,
	phone: phoneSchema,
	address: z.string().max(500, 'Address too long').optional(),
	eventTypes: z.array(z.string().max(100)).default([]),
	servicesUsed: z.array(z.string().max(100)).default([]),
	lastPerformed: optionalDateSchema,
	lastContacted: optionalDateSchema,
	nextFollowUp: nextFollowUpSchema.optional(),
	notes: z.string().max(5000, 'Notes too long').optional(),
	status: clientStatusSchema,
	events: z.array(z.string()).default([])
});

export type ValidatedClient = z.infer<typeof clientSchema>;

// ===========================
// PERFORMER SCHEMA
// ===========================

export const skillCategorySchema = z.enum([
	'fire',
	'balloon',
	'stilt',
	'juggle',
	'aerial',
	'magic',
	'other'
]);

export const skillLevelSchema = z.enum(['beginner', 'intermediate', 'expert']);

export const performerSkillSchema = z.object({
	category: skillCategorySchema,
	props: z.array(z.string().max(100)).default([]),
	acts: z.array(z.string().max(100)).default([]),
	level: skillLevelSchema
});

export const availabilityStatusSchema = z.enum(['available', 'unavailable', 'tentative']);

export const availabilitySchema = z.object({
	date: dateSchema,
	status: availabilityStatusSchema,
	notes: z.string().max(500).optional()
});

export const payRateSchema = z.object({
	category: z.string().max(100),
	rate: z.number().min(0, 'Rate cannot be negative').max(100000, 'Rate too high'),
	unit: z.enum(['hourly', 'per-event', 'per-day'])
});

export const documentSchema = z.object({
	type: z.enum(['contract', 'insurance', 'certification', 'other']),
	name: z.string().min(1).max(255),
	url: urlSchema,
	expiryDate: optionalDateSchema
});

export const performerSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
	email: emailSchema,
	phone: phoneSchema,
	address: z.string().max(500).optional(),
	profilePhoto: urlSchema,
	skills: z.array(performerSkillSchema).default([]),
	availability: z.array(availabilitySchema).default([]),
	events: z.array(z.string()).default([]),
	notes: z.string().max(5000).optional(),
	payRate: z.array(payRateSchema).default([]),
	documents: z.array(documentSchema).default([]),
	pay: z.number().min(0).optional()
});

export type ValidatedPerformer = z.infer<typeof performerSchema>;

// ===========================
// EVENT SCHEMA
// ===========================

export const eventStatusSchema = z.enum([
	'inquiry',
	'confirmed',
	'deposit-received',
	'completed',
	'cancelled'
]);

export const eventLocationSchema = z.object({
	address: z.string().min(1, 'Address is required').max(500),
	notes: z.string().max(500).optional(),
	mapLink: urlSchema
});

export const eventPerformerSchema = z.object({
	performer: z.string().min(1, 'Performer ID is required'),
	displayName: z.string().max(255).optional(),
	role: z.string().max(255),
	pay: z.number().min(0).max(100000),
	confirmed: z.boolean()
});

export const performanceTimeSchema = z.object({
	start: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (use HH:MM)'),
	end: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (use HH:MM)')
});

export const contractInfoSchema = z.object({
	sent: z.boolean(),
	sentDate: optionalDateSchema,
	received: z.boolean(),
	receivedDate: optionalDateSchema,
	url: urlSchema
});

export const depositSchema = z.object({
	required: z.boolean(),
	amount: z.number().min(0).optional(),
	received: z.boolean(),
	receivedDate: optionalDateSchema
});

export const paymentSchema = z.object({
	totalValue: z.number().min(0).max(1000000),
	paid: z.boolean(),
	paidDate: optionalDateSchema,
	method: z.enum(['check', 'cash', 'transfer', 'credit-card']).optional()
});

export const recurringSchema = z.object({
	type: z.enum(['weekly', 'monthly', 'yearly']),
	endDate: dateSchema
});

export const eventSchema = z.object({
	name: z.string().min(1, 'Event name is required').max(255),
	date: dateSchema,
	client: z.string().min(1, 'Client is required'),
	location: eventLocationSchema,
	status: eventStatusSchema,
	performers: z.array(eventPerformerSchema).default([]),
	services: z.array(z.string().max(100)).default([]),
	performanceTime: performanceTimeSchema,
	callTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (use HH:MM)'),
	costume: z.string().max(500).optional(),
	equipmentNeeded: z.array(z.string().max(100)).default([]),
	contract: contractInfoSchema,
	deposit: depositSchema,
	payment: paymentSchema,
	notes: z.string().max(5000).optional(),
	clientLiaison: z.string().max(255).optional(),
	gigManager: z.string().max(255).optional(),
	recurring: recurringSchema.optional()
});

export type ValidatedEvent = z.infer<typeof eventSchema>;

// ===========================
// AGENT SCHEMA
// ===========================

export const contactMethodSchema = z.enum(['email', 'phone', 'text']);

export const opportunitySchema = z.object({
	date: dateSchema,
	description: z.string().max(1000),
	status: z.enum(['pending', 'accepted', 'rejected']),
	value: z.number().min(0).optional()
});

export const agentSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255),
	agency: z.string().max(255),
	email: emailSchema,
	phone: phoneSchema,
	preferredContactMethod: contactMethodSchema,
	specialization: z.array(z.string().max(100)).default([]),
	opportunitiesSent: z.array(opportunitySchema).default([]),
	partnershipStartDate: optionalDateSchema,
	paymentTerms: z.string().max(1000).optional(),
	commissionRate: z.number().min(0).max(100).optional(),
	notes: z.string().max(5000).optional()
});

export type ValidatedAgent = z.infer<typeof agentSchema>;

// ===========================
// TASK SCHEMA
// ===========================

export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const relatedEntitySchema = z.object({
	type: z.enum(['client', 'performer', 'event', 'agent']),
	id: z.string().min(1)
});

export const taskSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255),
	description: z.string().max(2000).optional(),
	dueDate: dateSchema,
	completed: z.boolean(),
	priority: taskPrioritySchema,
	relatedTo: relatedEntitySchema.optional()
});

export type ValidatedTask = z.infer<typeof taskSchema>;

// ===========================
// USER SCHEMA
// ===========================

export const userRoleSchema = z.enum(['admin', 'user', 'viewer']);

export const userSchema = z.object({
	email: emailSchema,
	displayName: z.string().min(1).max(255).optional(),
	role: userRoleSchema
});

export type ValidatedUser = z.infer<typeof userSchema>;

// ===========================
// AUTH SCHEMAS
// ===========================

export const signInSchema = z.object({
	email: emailSchema,
	password: z.string().min(6, 'Password must be at least 6 characters')
});

export const createAccountSchema = z.object({
	email: emailSchema,
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number'),
	displayName: z.string().min(1).max(255),
	role: userRoleSchema
});

export const resetPasswordSchema = z.object({
	email: emailSchema
});

// ===========================
// API SCHEMAS
// ===========================

export const naturalLanguageImportSchema = z.object({
	text: z
		.string()
		.min(1, 'Text is required')
		.max(10000, 'Text is too long (max 10,000 characters)')
});

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Validate data against a schema and return typed result
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
	const result = schema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	} else {
		const errors = result.error.issues.map((err) => {
			const path = err.path.join('.');
			return path ? `${path}: ${err.message}` : err.message;
		});
		return { success: false, errors };
	}
}

/**
 * Validate and throw if invalid
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
	return schema.parse(data);
}

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(input: string): string {
	return input
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+\s*=/gi, '') // Remove inline event handlers
		.trim();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
	const sanitized = { ...obj };

	for (const key in sanitized) {
		if (typeof sanitized[key] === 'string') {
			sanitized[key] = sanitizeString(sanitized[key]) as any;
		} else if (typeof sanitized[key] === 'object' && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
			sanitized[key] = sanitizeObject(sanitized[key]);
		} else if (Array.isArray(sanitized[key])) {
			sanitized[key] = sanitized[key].map((item: any) =>
				typeof item === 'string' ? sanitizeString(item) : typeof item === 'object' ? sanitizeObject(item) : item
			) as any;
		}
	}

	return sanitized;
}
