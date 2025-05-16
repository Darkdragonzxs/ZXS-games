
(function() {
  // Grab a reference to your game iframe
  const iframe = document.getElementById('game-iframe');

  // Utility: clone the original KeyboardEvent
  function cloneKeyboardEvent(original, type) {
    return new KeyboardEvent(type, {
      key:            original.key,
      code:           original.code,
      location:       original.location,
      ctrlKey:        original.ctrlKey,
      shiftKey:       original.shiftKey,
      altKey:         original.altKey,
      metaKey:        original.metaKey,
      repeat:         original.repeat,
      isComposing:    original.isComposing,
      bubbles:        true,
      cancelable:     true,
      composed:       true
    });
  }

  // Forward one event type into the iframe
  function forward(type) {
    window.addEventListener(type, e => {
      if (!iframe || !iframe.contentWindow || iframeContainer.style.display === 'none') return;

      try {
        // focus the iframe window so it can receive input
        iframe.contentWindow.focus();

        // dispatch a cloned event into the iframe's document
        const ev = cloneKeyboardEvent(e, type);
        iframe.contentWindow.document.dispatchEvent(ev);

        // prevent the parent page from also handling navigation
        e.preventDefault();
        e.stopPropagation();
      } catch (err) {
        // cross-origin or other issue: nothing we can do
        // console.warn('Could not forward key event to iframe:', err);
      }
    }, true);
  }

  // Forward keydown, keyup, and keypress
  ['keydown','keyup','keypress'].forEach(forward);
})();
