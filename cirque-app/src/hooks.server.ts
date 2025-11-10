import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

/**
 * SvelteKit Server Hooks
 * AUTHENTICATION DISABLED FOR DEVELOPMENT
 * All route protection has been disabled to allow unrestricted access
 */

export const handle: Handle = async ({ event, resolve }) => {
	const { url, cookies } = event;

	// AUTHENTICATION DISABLED - Route protection commented out for development
	// // Define protected routes that require authentication
	// const protectedRoutes = [
	// 	'/events',
	// 	'/clients',
	// 	'/performers',
	// 	'/agents',
	// 	'/tasks',
	// 	'/contracts',
	// 	'/api/import-natural-language'
	// ];

	// // Define public routes that don't require authentication
	// const publicRoutes = ['/login', '/'];

	// // Check if current route is protected
	// const isProtectedRoute = protectedRoutes.some((route) => url.pathname.startsWith(route));

	// // For protected routes, check authentication
	// // Note: Since we're using Firebase client-side auth, this is a basic server-side check
	// // Real auth validation happens client-side with Firebase Auth state
	// if (isProtectedRoute) {
	// 	// Check for Firebase session cookie (if you implement it)
	// 	// For now, we'll rely on client-side auth checks
	// 	// This is a placeholder for future server-side session validation

	// 	// You can implement custom session cookies here if needed
	// 	// const sessionCookie = cookies.get('session');
	// 	// if (!sessionCookie) {
	// 	//     throw redirect(303, '/login');
	// 	// }
	// }

	// Add security headers
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html
	});

	// Set security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

	// Content Security Policy
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"img-src 'self' data: https: blob:",
			"font-src 'self' data: https://fonts.gstatic.com",
			"connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.openai.com wss://*.firebaseio.com",
			"frame-src 'self' https://*.firebaseapp.com",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'",
			'upgrade-insecure-requests'
		].join('; ')
	);

	return response;
};
