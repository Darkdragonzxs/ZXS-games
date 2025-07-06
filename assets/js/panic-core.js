// panic-core.js
(function () {
  let panicKey = localStorage.getItem('panicKey') || ']';
  let panicURL = localStorage.getItem('panicURL') || 'https://google.com';

  window.addEventListener('storage', () => {
    panicKey = localStorage.getItem('panicKey') || ']';
    panicURL = localStorage.getItem('panicURL') || 'https://google.com';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === panicKey) {
      try {
        window.top.location.href = panicURL;
      } catch (err) {
        console.error('Panic redirect failed:', err);
      }
    }
  }, true);
})();
