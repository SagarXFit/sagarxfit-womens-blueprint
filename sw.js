const CACHE_NAME = 'sagarxfit-women-v2';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js'
];

// Install Event: Save files to phone memory
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch Event: Serve files from memory if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
    );
});
