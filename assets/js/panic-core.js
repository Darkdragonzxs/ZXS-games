(function () {
  let panicKey = localStorage.getItem('panicKey') || ']';
  let panicURL = localStorage.getItem('panicURL') || 'https://google.com';
  let panicKeyActive = true;


  window.addEventListener('storage', () => {
    panicKey = localStorage.getItem('panicKey') || ']';
    panicURL = localStorage.getItem('panicURL') || 'https://google.com';
  });

  document.addEventListener('keydown', (e) => {
    if (panicKeyActive && e.key === panicKey) {
      window.location.href = panicURL;
    }
  });
})();
