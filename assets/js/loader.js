(function () {
  const fullscreenSections = [
    { sectionId: "fullscreen-games", iframeSelector: "iframe.fullscreen-iframe" },
    { sectionId: "fullscreen-apps", iframeSelector: "iframe.fullscreen-iframe" },
    { sectionId: "fullscreen-partners", iframeSelector: "iframe.fullscreen-iframe" },
    { sectionId: "fullscreen-proxy", iframeSelector: "iframe.fullscreen-iframe" },
    { sectionId: "fullscreen-vm", iframeSelector: "iframe.fullscreen-iframe" },
  ];

  // Create the loading overlay element
  function createLoadingOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "zxs-loading-overlay";
    overlay.innerHTML = `
      <div class="zxs-loading-content">
        <img src="/assets/images/loading.gif" alt="Loading..." class="zxs-loading-gif" />
        <div class="zxs-loading-text">Loading</div>
        <div class="zxs-loading-bar-wrap">
          <div class="zxs-loading-bar"></div>
        </div>
      </div>
    `;
    return overlay;
  }

  // Inject styles for loading overlay and progress bar
  function injectLoadingStyles() {
    if (document.getElementById("zxs-loading-style")) return;
    const style = document.createElement("style");
    style.id = "zxs-loading-style";
    style.textContent = `
      .zxs-loading-overlay {
        position: absolute;
        z-index: 9999;
        top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw; height: 100vh;
        background: rgba(2,4,2, 0.93);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        pointer-events: all;
        transition: opacity 0.2s;
      }
      .zxs-loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 26px;
      }
      .zxs-loading-gif {
        width: 88px;
        height: 88px;
        object-fit: contain;
        margin-bottom: 12px;
      }
      .zxs-loading-text {
        font-family: 'Russo One', sans-serif;
        color: #00ff5e;
        font-size: 1.8rem;
        font-weight: 900;
        letter-spacing: 0.14em;
        margin-bottom: 12px;
        text-align: center;
        user-select: none;
      }
      .zxs-loading-bar-wrap {
        width: 250px;
        height: 18px;
        border-radius: 10px;
        background: #191919;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.23);
        margin-top: 4px;
      }
      .zxs-loading-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg,#00ff5e 0%,#00ffa4 100%);
        border-radius: 10px;
        transition: width 0.20s;
      }
      @media (max-width: 600px) {
        .zxs-loading-bar-wrap { width: 90vw; min-width: 110px; }
        .zxs-loading-gif { width: 56px; height: 56px;}
        .zxs-loading-text { font-size: 1.1rem;}
      }
    `;
    document.head.appendChild(style);
  }

  function startProgressBar(barEl) {
    let progress = 0;
    let interval;
    function step() {
      progress += Math.random() * 7 + 2; 
      if (progress > 95) progress = 95; 
      barEl.style.width = progress + "%";
      if (progress < 95) {
        interval = setTimeout(step, Math.random() * 180 + 90);
      }
    }
    step();
    return function finishBar() {
      clearTimeout(interval);
      barEl.style.width = "100%";
    };
  }

  function setupLoadingForSection(sectionId, iframeSelector) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const iframe = section.querySelector(iframeSelector);
    if (!iframe) return;

    const overlay = createLoadingOverlay();
    section.style.position = "relative";
    section.appendChild(overlay);

    const barEl = overlay.querySelector(".zxs-loading-bar");
    let finishProgressBar = startProgressBar(barEl);

    const observer = new MutationObserver(() => {
      if (section.classList.contains("active")) {
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "all";
        barEl.style.width = "0%";
        finishProgressBar = startProgressBar(barEl);
      }
    });
    observer.observe(section, { attributes: true, attributeFilter: ["class"] });

    iframe.addEventListener("load", () => {
      finishProgressBar();
      setTimeout(() => {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
      }, 300);
    });

    if (section.classList.contains("active") && iframe.contentWindow.document.readyState !== "complete") {
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "all";
    } else {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }
  }

  function initLoadingHelper() {
    injectLoadingStyles();
    fullscreenSections.forEach(({ sectionId, iframeSelector }) => {
      setupLoadingForSection(sectionId, iframeSelector);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLoadingHelper);
  } else {
    initLoadingHelper();
  }
})();
