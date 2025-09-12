class DomainTrie {
    constructor() {
        this.root = {};
    }

    add(domain) {
        let node = this.root;
        const parts = domain.split('.').reverse();
        for (const part of parts) {
            if (!node[part]) {
                node[part] = {};
            }
            node = node[part];
        }
        node.isBlocked = true;
    }

    isBlocked(hostname) {
        let node = this.root;
        const parts = hostname.split('.').reverse();
        for (const part of parts) {
            if (!node[part]) {
                return false;
            }
            node = node[part];
            if (node.isBlocked) {
                return true;
            }
        }
        return false;
    }
}

// dumb hack to allow firefox to work (please dont do this in prod)
if (typeof crossOriginIsolated === 'undefined' && navigator.userAgent.includes('Firefox')) {
  Object.defineProperty(self, "crossOriginIsolated", {
    value: true,
    writable: false,
  });
}

importScripts(
  '/b/s/scramjet.shared.js',
  '/b/s/scramjet.worker.js',
  '/b/u/bunbun.js',
  '/b/u/concon.js',
  '/b/u/serser.js',
);

const scramjet = new ScramjetServiceWorker();
const uv = new UVServiceWorker();

let scramjetConfigLoaded = false;
const CACHE_NAME = 'waves-cache';
let domainTrie;

const BLOCKLIST = "/api/blocklist";

async function updateBlockedDomains() {
    try {
        const response = await fetch(BLOCKLIST);
        if (!response.ok) {
            throw new Error(`HTTP error fetching blocklist from backend! Status: ${response.status}`);
        }
        const text = await response.text();
        const domains = text.split("\n").map(d => d.trim()).filter(d => d.length > 0);

        domainTrie = new DomainTrie();
        domainTrie.add('itemfix.com');

        domains.forEach(domain => {
            if (domain.startsWith('www.')) {
                domainTrie.add(domain.slice(4));
            } else {
                domainTrie.add(domain);
            }
        });

    } catch (err) {
        console.error(`Service Worker: Failed to update blocked domains: ${err.message}`);
    }
}

self.addEventListener('install', event => {
    event.waitUntil(updateBlockedDomains());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    event.respondWith((async () => {
        try {
            let decodedUrl = null;
            try {
                if (url.pathname.startsWith(__uv$config.prefix)) {
                    const encodedPart = url.pathname.slice(__uv$config.prefix.length);
                    decodedUrl = __uv$config.decodeUrl(encodedPart);
                } else if (url.pathname.startsWith('/b/s/')) {
                    decodedUrl = scramjet.decode(url.pathname.slice('/b/s/'.length));
                }
            } catch (e) {
                console.error("Failed to decode URL:", e);
            }

            if (decodedUrl) {
                const hostname = new URL(decodedUrl).hostname;

                if (domainTrie && domainTrie.isBlocked(hostname)) {
                    const html = `
                        <!DOCTYPE html>
                        <html lang="en">
                          <head>
                            <meta charset="UTF-8">
                            <title>no</title>
                            <style>
                              @font-face {
                                font-family: 'Lexend';
                                src: url('../fonts/Lexend-Regular.woff2') format('woff2'),
                                     url('../fonts/Lexend-Regular.ttf') format('truetype');
                                font-weight: 400;
                                font-style: normal;
                                font-display: swap;
                              }
                              @font-face {
                                font-family: 'Lexend';
                                src: url('../fonts/Lexend-Bold.woff2') format('woff2'),
                                     url('../fonts/Lexend-Bold.ttf') format('truetype');
                                font-weight: 700;
                                font-style: normal;
                                font-display: swap;
                              }
                              html, body {
                                height: 100%;
                                margin: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                font-family: 'Lexend', sans-serif;
                                background-color: #000000;
                                color: #fff;
                                text-align: center;
                              }
                              ::selection {
                                background-color: #ffffff;
                                color: #000000;
                              }
                            </style>
                          </head>
                          <body>
                            <h1>You little gooner</h1>
                          </body>
                        </html>
                    `;
                    return new Response(html, {
                        status: 403,
                        statusText: 'Forbidden',
                        headers: {
                            'Content-Type': 'text/html'
                        }
                    });
                }
            }
            
            if (url.pathname.startsWith('/b/s/scramjet.') && !url.pathname.endsWith('scramjet.wasm.js')) {
              return fetch(request);
            }

            if (!scramjetConfigLoaded) {
              await scramjet.loadConfig();
              scramjetConfigLoaded = true;
            }

            if (scramjet.route(event)) {
              const response = await scramjet.fetch(event);
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
              return response;
            }

            if (uv.route(event)) {
              const response = await uv.fetch(event);
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
              return response;
            }
            
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }

            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;

        } catch (err) {
            console.error('ServiceWorker fetch error:', err);
            return fetch(request);
        }
    })());
});
