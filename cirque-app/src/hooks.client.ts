import { goto } from '$app/navigation';
import { authState } from '$lib/services/auth.svelte';
import type { HandleClientError } from '@sveltejs/kit';

/**
 * Client-side navigation guard
 * Redirects unauthenticated users to login page
 */

let navigationCheckInitialized = false;

if (typeof window !== 'undefined') {
	// Wait a bit for auth state to initialize
	setTimeout(() => {
		navigationCheckInitialized = true;
	}, 1000);
}

/**
 * AUTHENTICATION DISABLED FOR DEVELOPMENT
 * All route protection has been disabled to allow unrestricted access
 */

/**
 * Check if route requires authentication
 */
// function requiresAuth(pathname: string): boolean {
// 	const protectedRoutes = [
// 		'/events',
// 		'/clients',
// 		'/performers',
// 		'/agents',
// 		'/tasks',
// 		'/contracts'
// 	];

// 	return protectedRoutes.some((route) => pathname.startsWith(route));
// }

/**
 * Handle navigation
 */
// if (typeof window !== 'undefined') {
// 	// Listen for navigation events
// 	let lastPath = window.location.pathname;

// 	// Check on initial load
// 	window.addEventListener('load', () => {
// 		checkAuth(window.location.pathname);
// 	});

// 	// Monitor navigation changes using MutationObserver
// 	const observer = new MutationObserver(() => {
// 		if (window.location.pathname !== lastPath) {
// 			lastPath = window.location.pathname;
// 			checkAuth(lastPath);
// 		}
// 	});

// 	observer.observe(document, { subtree: true, childList: true });

// 	function checkAuth(pathname: string) {
// 		if (!navigationCheckInitialized) return;

// 		if (requiresAuth(pathname) && !authState.currentUser && !authState.loading) {
// 			goto('/login');
// 		}

// 		// Redirect from login if already authenticated
// 		if (pathname === '/login' && authState.currentUser) {
// 			goto('/');
// 		}
// 	}
// }

/**
 * Handle client-side errors
 */
export const handleError: HandleClientError = ({ error, event }) => {
	console.error('Client error:', error, 'at', event.url.pathname);

	return {
		message: 'An unexpected error occurred',
		code: (error as any)?.code ?? 'UNKNOWN'
	};
};
