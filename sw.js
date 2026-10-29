const CACHE_NAME = 'v1_cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './archive.html',
  './manifest.json',
  './logo.png',
  './script.js',
  './archive_script.js',
  './style.css'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch Cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
