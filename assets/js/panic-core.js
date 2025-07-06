(function () {
  let panicKey = localStorage.getItem('panicKey') || ']';
  let panicURL = localStorage.getItem('panicURL') || 'https://google.com';

  window.addEventListener('storage', () => {
    panicKey = localStorage.getItem('panicKey') || ']';
    panicURL = localStorage.getItem('panicURL') || 'https://google.com';
  });

  // Listen for key presses inside iframe
  document.addEventListener('keydown', (e) => {
    if (e.key === panicKey) {
      try {
        window.top.location.href = panicURL;
      } catch (err) {
        console.error('Cannot redirect top window:', err);
      }
    }
  }, true); // capture phase
})();
