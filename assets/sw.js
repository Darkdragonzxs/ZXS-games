// Import the Scramjet worker.js from /b/s/
importScripts('/b/s/scramjet.worker.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

let scramjetConfigLoaded = false;
const CACHE_NAME = 'waves-cache';

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  event.respondWith((async () => {
    try {
      if (!scramjetConfigLoaded) {
        await scramjet.loadConfig();
        scramjetConfigLoaded = true;
      }

      // Ignore fetching SW/worker JS and WASM files themselves
      if (request.url.includes('/b/s/') && request.url.endsWith('.js') && !request.url.endsWith('scramjet.wasm.wasm')) {
        return fetch(request);
      }

      // Let Scramjet handle proxyable requests
      if (scramjet.route(event)) {
        const response = await scramjet.fetch(event);
        if (request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        }
        return response;
      }

      // Fallback: cache first, then network
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;

      const networkResponse = await fetch(request);
      if (request.method === 'GET' && networkResponse && networkResponse.ok) {
        const responseClone = networkResponse.clone();
        cache.put(request, responseClone);
      }
      return networkResponse;

    } catch (err) {
      console.error('ServiceWorker fetch error:', err);
      return fetch(request);
    }
  })());
});
