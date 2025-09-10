importScripts("/scram/scramjet.shared.js", "/scram/scramjet.worker.js");

const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
    const url = new URL(event.request.url);

    // Only proxy requests under /scram/
    if (url.pathname.startsWith("/scram/")) {
        await scramjet.loadConfig();
        if (scramjet.route(event)) {
            return scramjet.fetch(event);
        }
    }

    return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});
