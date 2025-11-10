/**
 * Audit Logging Service
 * Tracks security-critical operations and user actions
 */

import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getDbInstance } from '$lib/firebase';
import { getCurrentUserId, getCurrentUserEmail } from './auth.svelte';
import { browser } from '$app/environment';

export type AuditAction =
	// Authentication
	| 'auth:login'
	| 'auth:logout'
	| 'auth:failed_login'
	| 'auth:password_reset'
	| 'auth:account_created'
	// Data operations
	| 'data:create'
	| 'data:update'
	| 'data:delete'
	| 'data:read'
	// API operations
	| 'api:call'
	| 'api:rate_limited'
	| 'api:unauthorized'
	// Security events
	| 'security:prompt_injection_detected'
	| 'security:invalid_input'
	| 'security:permission_denied'
	// Settings
	| 'settings:changed'
	| 'user:role_changed';

export interface AuditLogEntry {
	id?: string;
	timestamp: Date;
	userId: string | null;
	userEmail: string | null;
	action: AuditAction;
	resource?: string; // e.g., "clients/abc123"
	details?: Record<string, any>;
	ipAddress?: string;
	userAgent?: string;
	severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Log an audit event
 */
export async function logAuditEvent(
	action: AuditAction,
	options: {
		resource?: string;
		details?: Record<string, any>;
		severity?: AuditLogEntry['severity'];
		ipAddress?: string;
		userAgent?: string;
	} = {}
): Promise<void> {
	if (!browser) return;

	const db = getDbInstance();
	if (!db) {
		console.warn('Cannot log audit event: Database not available');
		return;
	}

	try {
		const entry: Omit<AuditLogEntry, 'id' | 'timestamp'> = {
			userId: getCurrentUserId(),
			userEmail: getCurrentUserEmail(),
			action,
			resource: options.resource,
			details: options.details || {},
			ipAddress: options.ipAddress,
			userAgent: options.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
			severity: options.severity || getSeverityForAction(action)
		};

		await addDoc(collection(db, 'audit_logs'), {
			...entry,
			timestamp: serverTimestamp()
		});

		// Also log to console for development
		if (entry.severity === 'error' || entry.severity === 'critical') {
			console.error('🚨 Audit Log:', action, entry);
		} else if (entry.severity === 'warning') {
			console.warn('⚠️  Audit Log:', action, entry);
		} else {
			console.log('📝 Audit Log:', action, entry);
		}
	} catch (error) {
		console.error('Failed to log audit event:', error);
	}
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
	action: Extract<AuditAction, `auth:${string}`>,
	details?: Record<string, any>
): Promise<void> {
	await logAuditEvent(action, {
		details,
		severity: action === 'auth:failed_login' ? 'warning' : 'info'
	});
}

/**
 * Log data operations
 */
export async function logDataEvent(
	action: Extract<AuditAction, `data:${string}`>,
	resource: string,
	details?: Record<string, any>
): Promise<void> {
	await logAuditEvent(action, {
		resource,
		details,
		severity: action === 'data:delete' ? 'warning' : 'info'
	});
}

/**
 * Log security events
 */
export async function logSecurityEvent(
	action: Extract<AuditAction, `security:${string}`>,
	details?: Record<string, any>
): Promise<void> {
	await logAuditEvent(action, {
		details,
		severity: 'warning'
	});
}

/**
 * Log API events
 */
export async function logApiEvent(
	action: Extract<AuditAction, `api:${string}`>,
	details?: Record<string, any>
): Promise<void> {
	await logAuditEvent(action, {
		details,
		severity: action === 'api:unauthorized' || action === 'api:rate_limited' ? 'warning' : 'info'
	});
}

/**
 * Get audit logs for a user (admin only)
 */
export async function getAuditLogs(options: {
	userId?: string;
	action?: AuditAction;
	limit?: number;
	since?: Date;
}): Promise<AuditLogEntry[]> {
	if (!browser) return [];

	const db = getDbInstance();
	if (!db) return [];

	try {
		let q = query(
			collection(db, 'audit_logs'),
			orderBy('timestamp', 'desc'),
			limit(options.limit || 100)
		);

		if (options.userId) {
			q = query(q, where('userId', '==', options.userId));
		}

		if (options.action) {
			q = query(q, where('action', '==', options.action));
		}

		if (options.since) {
			const sinceTimestamp = serverTimestamp();
			q = query(q, where('timestamp', '>=', sinceTimestamp));
		}

		const snapshot = await getDocs(q);
		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			timestamp: doc.data().timestamp?.toDate()
		})) as AuditLogEntry[];
	} catch (error) {
		console.error('Failed to get audit logs:', error);
		return [];
	}
}

/**
 * Get recent security events (admin only)
 */
export async function getSecurityEvents(limitCount: number = 50): Promise<AuditLogEntry[]> {
	if (!browser) return [];

	const db = getDbInstance();
	if (!db) return [];

	try {
		const q = query(
			collection(db, 'audit_logs'),
			where('action', 'in', [
				'security:prompt_injection_detected',
				'security:invalid_input',
				'security:permission_denied',
				'auth:failed_login',
				'api:unauthorized',
				'api:rate_limited'
			]),
			orderBy('timestamp', 'desc'),
			limit(limitCount)
		);

		const snapshot = await getDocs(q);
		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			timestamp: doc.data().timestamp?.toDate()
		})) as AuditLogEntry[];
	} catch (error) {
		console.error('Failed to get security events:', error);
		return [];
	}
}

/**
 * Determine severity based on action
 */
function getSeverityForAction(action: AuditAction): AuditLogEntry['severity'] {
	if (action.startsWith('security:')) return 'warning';
	if (action === 'auth:failed_login') return 'warning';
	if (action === 'api:unauthorized') return 'warning';
	if (action === 'api:rate_limited') return 'warning';
	if (action === 'data:delete') return 'warning';
	if (action === 'user:role_changed') return 'warning';
	return 'info';
}

/**
 * Clean up old audit logs (to be run periodically)
 * Keep logs for 90 days by default
 */
export async function cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
	if (!browser) return 0;

	const db = getDbInstance();
	if (!db) return 0;

	try {
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

		const q = query(
			collection(db, 'audit_logs'),
			where('timestamp', '<', serverTimestamp()),
			limit(1000) // Delete in batches
		);

		const snapshot = await getDocs(q);
		let deletedCount = 0;

		// Note: In production, use Cloud Functions for batch deletes
		// This is just a reference implementation
		console.log(`Would delete ${snapshot.size} old audit log entries`);
		deletedCount = snapshot.size;

		return deletedCount;
	} catch (error) {
		console.error('Failed to cleanup audit logs:', error);
		return 0;
	}
}
