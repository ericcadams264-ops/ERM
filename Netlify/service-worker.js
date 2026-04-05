const CACHE_NAME = 'fisiota-cache-v5';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './data.js',
    './config.js',
    './assets.js',
    './db.js',
    './archive-manager.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://unpkg.com/signature_pad@4.1.7/dist/signature_pad.umd.js'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching Assets');
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('One or more assets failed to cache', err);
            });
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event (Cache First Strategy)
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Filter which requests to handle
    const url = new URL(event.request.url);
    const isSameOrigin = url.origin === self.location.origin;
    const isExternalAsset = url.href.includes('tailwindcss') || url.href.includes('lucide') || url.href.includes('signature_pad');

    if (!isSameOrigin && !isExternalAsset) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found (even if it has query params, match should handle it if ignoreSearch is true)
            // But we didn't use ignoreSearch here. 
            // Better: try to match without query params if no exact match
            if (cachedResponse) return cachedResponse;

            return fetch(event.request).then((networkResponse) => {
                // If it's a valid response, maybe cache it? 
                // For now, just return it.
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                return networkResponse;
            }).catch(() => {
                // Return cached index.html for navigation requests when offline
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                return undefined;
            });
        })
    );
});
