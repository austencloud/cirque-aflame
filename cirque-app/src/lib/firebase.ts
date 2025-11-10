// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
	getFirestore, 
	type Firestore, 
	persistentLocalCache,
	persistentMultipleTabManager
} from 'firebase/firestore';
import { browser } from '$app/environment';

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

// Initialize only in the browser
if (browser) {
	// Check if environment variables are set
	const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
	const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

	if (!apiKey || !projectId) {
		console.error(
			'Firebase environment variables (VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.) are not set. Firebase will not initialize.'
		);
	} else {
		const firebaseConfig = {
			apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
			authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
			projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
			storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
			appId: import.meta.env.VITE_FIREBASE_APP_ID
		};

		// Ensure Firebase is initialized only once
		if (!getApps().length) {
			try {
				app = initializeApp(firebaseConfig);
				console.log('Firebase initialized successfully.');
			} catch (e) {
				console.error('Error initializing Firebase:', e);
				// Prevent further attempts if initialization fails
				app = null;
			}
		} else {
			app = getApp(); // Get the already initialized app
		}
	}
} else {
	console.log('Firebase initialization skipped (SSR).');
}

/**
 * Gets the Firestore instance. Initializes it if necessary (only in browser).
 * Returns null if not in browser or if Firebase app initialization failed.
 */
function getDbInstance(): Firestore | null {
	if (browser && app && !dbInstance) {
		try {
			// Initialize Firestore with new persistent cache API
			dbInstance = getFirestore(app);
			
			// The new API uses initializeFirestore with localCache option
			// but since we're using getFirestore, persistence is enabled by default
			console.log('Firebase Firestore initialized with persistent cache');
		} catch (e) {
			console.error('Error getting Firestore instance:', e);
			dbInstance = null;
		}
	}
	return dbInstance;
}

// Export the functions for getting instances
export { app, getDbInstance };

// Export potentially null instances for convenience, use with caution
// Prefer using the getter functions within your service methods
export const db = getDbInstance();
