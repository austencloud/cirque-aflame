/**
 * Authentication and Authorization Service
 * Handles user roles, permissions, and Firebase Authentication
 */

import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	type User as FirebaseUser,
	sendPasswordResetEmail,
	updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '$lib/firebase';
import { getDbInstance } from '$lib/firebase';
import { browser } from '$app/environment';
import type { User } from '$lib/types';

export type UserRole = 'admin' | 'user' | 'viewer';

// Auth instance
let auth: ReturnType<typeof getAuth> | null = null;

// Initialize auth only in browser
if (browser) {
	auth = getAuth(app);
}

/**
 * Auth State Manager - Svelte 5 Runes Implementation
 */
class AuthStateManager {
	#currentUser = $state<FirebaseUser | null>(null);
	#userProfile = $state<User | null>(null);
	#loading = $state(false); // Start with false to avoid SSR issues
	#error = $state<string | null>(null);
	#initialized = false;

	constructor() {
		// Defer initialization to ensure we're in the browser
		if (browser) {
			this.init();
		}
	}

	init() {
		if (this.#initialized || !browser || !auth) return;
		this.#initialized = true;
		this.#loading = true;

		// Listen to auth state changes
		onAuthStateChanged(auth, async (firebaseUser) => {
			this.#currentUser = firebaseUser;

			if (firebaseUser) {
				// Load user profile from Firestore
				await this.#loadUserProfile(firebaseUser.uid);
			} else {
				this.#userProfile = null;
			}

			this.#loading = false;
		});
	}

	async #loadUserProfile(uid: string) {
		const db = getDbInstance();
		if (!db) return;

		try {
			const userDoc = await getDoc(doc(db, 'users', uid));
			if (userDoc.exists()) {
				this.#userProfile = { id: userDoc.id, ...userDoc.data() } as User;
			} else {
				// Create default user profile if it doesn't exist
				const defaultProfile: Omit<User, 'id'> = {
					email: this.#currentUser?.email || '',
					displayName: this.#currentUser?.displayName || '',
					role: 'viewer', // Default to lowest privilege
					createdAt: new Date(),
					updatedAt: new Date()
				};
				await setDoc(doc(db, 'users', uid), {
					...defaultProfile,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				});
				this.#userProfile = { id: uid, ...defaultProfile };
			}
		} catch (error) {
			console.error('Error loading user profile:', error);
			this.#error = 'Failed to load user profile';
		}
	}

	get currentUser() {
		return this.#currentUser;
	}

	get userProfile() {
		return this.#userProfile;
	}

	get loading() {
		return this.#loading;
	}

	get error() {
		return this.#error;
	}

	clearError() {
		this.#error = null;
	}
}

// Export singleton instance - only create in browser to avoid SSR issues
export const authState = browser ? new AuthStateManager() : ({
	currentUser: null,
	userProfile: null,
	loading: false,
	error: null,
	clearError: () => {}
} as AuthStateManager);

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
	if (!auth) {
		return { success: false, error: 'Auth not initialized' };
	}

	try {
		await signInWithEmailAndPassword(auth, email, password);
		return { success: true };
	} catch (error: any) {
		console.error('Sign in error:', error);
		let errorMessage = 'Failed to sign in';

		switch (error.code) {
			case 'auth/user-not-found':
				errorMessage = 'No account found with this email';
				break;
			case 'auth/wrong-password':
				errorMessage = 'Incorrect password';
				break;
			case 'auth/invalid-email':
				errorMessage = 'Invalid email address';
				break;
			case 'auth/user-disabled':
				errorMessage = 'This account has been disabled';
				break;
			case 'auth/too-many-requests':
				errorMessage = 'Too many failed attempts. Please try again later';
				break;
			default:
				errorMessage = error.message || 'Failed to sign in';
		}

		return { success: false, error: errorMessage };
	}
}

/**
 * Create a new user account
 * Note: Only admins should be able to call this in production
 */
export async function createAccount(
	email: string,
	password: string,
	displayName: string,
	role: UserRole = 'viewer'
): Promise<{ success: boolean; error?: string; userId?: string }> {
	if (!auth) {
		return { success: false, error: 'Auth not initialized' };
	}

	const db = getDbInstance();
	if (!db) {
		return { success: false, error: 'Database not initialized' };
	}

	try {
		// Create auth account
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		// Update display name
		await updateProfile(user, { displayName });

		// Create user profile in Firestore
		const userProfile: Omit<User, 'id'> = {
			email,
			displayName,
			role,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		await setDoc(doc(db, 'users', user.uid), {
			...userProfile,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});

		return { success: true, userId: user.uid };
	} catch (error: any) {
		console.error('Create account error:', error);
		let errorMessage = 'Failed to create account';

		switch (error.code) {
			case 'auth/email-already-in-use':
				errorMessage = 'An account with this email already exists';
				break;
			case 'auth/invalid-email':
				errorMessage = 'Invalid email address';
				break;
			case 'auth/weak-password':
				errorMessage = 'Password is too weak. Use at least 6 characters';
				break;
			default:
				errorMessage = error.message || 'Failed to create account';
		}

		return { success: false, error: errorMessage };
	}
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
	if (!auth) {
		return { success: false, error: 'Auth not initialized' };
	}

	try {
		await firebaseSignOut(auth);
		return { success: true };
	} catch (error: any) {
		console.error('Sign out error:', error);
		return { success: false, error: error.message || 'Failed to sign out' };
	}
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
	if (!auth) {
		return { success: false, error: 'Auth not initialized' };
	}

	try {
		await sendPasswordResetEmail(auth, email);
		return { success: true };
	} catch (error: any) {
		console.error('Password reset error:', error);
		let errorMessage = 'Failed to send reset email';

		switch (error.code) {
			case 'auth/user-not-found':
				errorMessage = 'No account found with this email';
				break;
			case 'auth/invalid-email':
				errorMessage = 'Invalid email address';
				break;
			default:
				errorMessage = error.message || 'Failed to send reset email';
		}

		return { success: false, error: errorMessage };
	}
}

/**
 * AUTHENTICATION DISABLED FOR DEVELOPMENT
 * All authentication checks have been bypassed to allow unrestricted access
 */

/**
 * Check if user is authenticated
 * DISABLED: Always returns true for development
 */
export function isAuthenticated(): boolean {
	return true; // DISABLED: Always authenticated for development
}

/**
 * Get current user's role
 * DISABLED: Always returns 'admin' for development
 */
export function getCurrentUserRole(): UserRole {
	return 'admin'; // DISABLED: Always admin for development
}

/**
 * Check if user has required role
 * @param requiredRole - The minimum role required
 * @returns true if user has sufficient privileges
 * DISABLED: Always returns true for development
 */
export function checkUserRole(requiredRole: UserRole): boolean {
	return true; // DISABLED: Always authorized for development
}

/**
 * Check if current user is admin
 * DISABLED: Always returns true for development
 */
export function isAdmin(): boolean {
	return true; // DISABLED: Always admin for development
}

/**
 * Check if current user can write data
 * DISABLED: Always returns true for development
 */
export function canWrite(): boolean {
	return true; // DISABLED: Always can write for development
}

/**
 * Get current user ID
 */
export function getCurrentUserId(): string | null {
	return authState.currentUser?.uid || null;
}

/**
 * Get current user email
 */
export function getCurrentUserEmail(): string | null {
	return authState.currentUser?.email || null;
}
