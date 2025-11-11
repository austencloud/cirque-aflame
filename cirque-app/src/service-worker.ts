/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files  // static files
];

// Install service worker
sw.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

// Activate service worker
sw.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

// Listen to fetch events
sw.addEventListener('fetch', (event) => {
	// Ignore POST requests, Firebase requests, and API calls
	if (
		event.request.method !== 'GET' ||
		event.request.url.includes('firestore.googleapis.com') ||
		event.request.url.includes('firebase') ||
		event.request.url.includes('googleapis.com')
	) {
		return;
	}

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) {
				return response;
			}
		}

		// For everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// If we're online, cache the response for future use
			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			// If the network is unavailable, try the cache
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// If nothing is in the cache, return a generic offline response
			// for navigation requests
			if (event.request.mode === 'navigate') {
				return new Response(
					`
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Offline - Ringmaster</title>
						<style>
							body {
								font-family: system-ui, -apple-system, sans-serif;
								display: flex;
								align-items: center;
								justify-content: center;
								min-height: 100vh;
								margin: 0;
								background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
								color: white;
								text-align: center;
								padding: 20px;
							}
							.container {
								max-width: 500px;
							}
							h1 {
								font-size: 3rem;
								margin-bottom: 1rem;
							}
							p {
								font-size: 1.2rem;
								margin-bottom: 2rem;
							}
							button {
								background: white;
								color: #667eea;
								border: none;
								padding: 12px 24px;
								font-size: 1rem;
								font-weight: 600;
								border-radius: 8px;
								cursor: pointer;
								transition: transform 0.2s;
							}
							button:hover {
								transform: scale(1.05);
							}
						</style>
					</head>
					<body>
						<div class="container">
							<h1>🎪</h1>
							<h2>You're Offline</h2>
							<p>Ringmaster needs an internet connection to load new pages.</p>
							<p>Don't worry - any pages you've already visited are still available!</p>
							<button onclick="location.reload()">Try Again</button>
						</div>
					</body>
					</html>
				`,
					{
						status: 200,
						headers: { 'Content-Type': 'text/html' }
					}
				);
			}

			// For other requests, return a 503 error
			return new Response('Service Unavailable', {
				status: 503,
				statusText: 'Service Unavailable'
			});
		}
	}

	event.respondWith(respond());
});

// Handle messages from the client
sw.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		sw.skipWaiting();
	}
});
