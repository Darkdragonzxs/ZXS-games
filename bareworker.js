import * as BareMux from 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux/dist/index.mjs';

// Initialize connection with the worker at the root
const connection = new BareMux.BareMuxConnection("/bareworker.js");  // Path to your bareworker.js at the root

// Transport options for the worker connection (e.g., epoxy or libcurl)
const transportOptions = {
    "epoxy": "https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport/dist/index.mjs",
    "libcurl": "https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport/dist/index.mjs"
};

// Function to set transport
export async function setTransport(transport) {
    console.log(`Setting transport to ${transport}`);
    const transportURL = transportOptions[transport];
    if (!transportURL) {
        throw new Error(`Invalid transport method: ${transport}`);
    }

    try {
        await connection.setTransport(transportURL, [{ wisp: wispURL }]);
        console.log("Transport successfully set");
    } catch (error) {
        console.error("Error setting transport", error);
    }
}

// Register the service worker
const swScript = '/bareworker.js'; // Use the correct root path for your worker script

async function registerSW() {
    if (!navigator.serviceWorker) {
        console.error("Service workers are not supported by this browser");
        return;
    }

    try {
        await navigator.serviceWorker.register(swScript);
        console.log("Service Worker registered successfully");
    } catch (error) {
        console.error("Service Worker registration failed", error);
    }
}

// Call the function to register the service worker
registerSW();

// Now, initialize BareMux and set the transport
let retries = 0;
const maxRetries = 5;

async function initializeWorker() {
    try {
        await connection.setTransport(transportURL, [{ wisp: wispURL }]);
        console.log("Worker connected successfully");
    } catch (error) {
        if (retries < maxRetries) {
            retries++;
            console.log(`Retrying connection... Attempt ${retries}`);
            setTimeout(initializeWorker, 1000);  // Retry after 1 second
        } else {
            console.error("Failed to connect to worker after multiple attempts", error);
        }
    }
}

initializeWorker();
