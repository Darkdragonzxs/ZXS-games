(function () {
  let panicKey = localStorage.getItem('panicKey') || ']';
  let panicURL = localStorage.getItem('panicURL') || 'https://google.com';

  // Update values when localStorage changes (e.g. in index.html)
  window.addEventListener('storage', () => {
    panicKey = localStorage.getItem('panicKey') || ']';
    panicURL = localStorage.getItem('panicURL') || 'https://google.com';
  });

  // Key listener for panic
  document.addEventListener('keydown', (e) => {
    if (e.key === panicKey) {
      try {
        window.top.location.href = panicURL;
      } catch (err) {
        console.error('Panic redirect failed:', err);
      }
    }
  }, true); // Capture phase for deep focus
})();
