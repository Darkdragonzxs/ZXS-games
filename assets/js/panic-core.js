(function () {
  const getPanicKey = () => localStorage.getItem("panicKey") || "]";
  const getPanicURL = () => localStorage.getItem("panicURL") || "https://google.com";

  const listener = (e) => {
    try {
      const key = e.key;
      const panicKey = getPanicKey();
      if (key === panicKey) {
        window.top.location.href = getPanicURL(); 
      }
    } catch (err) {
      // in sandboxed iframes, top access might fail
      console.error("Panic redirect failed:", err);
    }
  };

  window.addEventListener("keydown", listener, true); 
})();
