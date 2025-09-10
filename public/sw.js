if (navigator.userAgent.includes('Firefox')) {
    Object.defineProperty(globalThis, 'crossOriginIsolated', {
        value: true,
        writable: false,
    });
}

importScripts("/public/scram/scramjet.shared.js", "/public/scram/scramjet.worker.js");

const scramjet = new ScramjetServiceWorker();

let playgroundData;

self.addEventListener("message", ({ data }) => {
    if (data.type === "playgroundData") {
        playgroundData = data;
    }
});

async function handleRequest(event) {
    await scramjet.loadConfig();
    if (scramjet.route(event)) {
        return scramjet.fetch(event);
    }
    return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});
