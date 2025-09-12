/*global self*/

// Simple Service Worker that only handles fetch requests for Scramjet
async function handleRequest(event) {
    // You can add any custom logic you want here for Scramjet
    // For example, route through a proxy or fetch resources

    return await fetch(event.request);  // Fetch requests directly if no proxying is needed
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});
