if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./uv.sw.js')
      .then(() => console.log('UV service worker registered'))
      .catch(err => console.error('SW registration failed:', err));
  });
}
