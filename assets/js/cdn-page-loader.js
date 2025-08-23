// CDN Page Loader for ZXS Games
// Load page content from jsdelivr CDN, extract text, and display it in the iframe.

const CDN_PREFIX = "https://cdn.jsdelivr.net/gh/Darkdragonzxs/ZXS-games@main/assets/pages/";

function loadPageIntoIframe(iframeId, pageName) {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;

  fetch(CDN_PREFIX + pageName)
    .then(res => res.text())
    .then(html => {
      // Extract only the <body> content for clean display
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : html;

      // Optional: Extract <style> tags and apply them to iframe
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      const styleContent = styleMatch ? styleMatch.map(m => m.replace(/<style[^>]*>|<\/style>/gi, "")).join("\n") : "";

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <html>
          <head>
            <base target="_parent">
            <style>${styleContent}</style>
          </head>
          <body style="background: transparent; color: inherit; font-family: inherit;">
            ${bodyContent}
          </body>
        </html>
      `);
      doc.close();
    })
    .catch(() => {
      // Display error if CDN file not found
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`<body style="color:red; font-family:Orbitron,sans-serif; background: #222;">Failed to load page: ${pageName}</body>`);
      doc.close();
    });
}

// Map section to CDN HTML page
const CDN_PAGE_MAPPINGS = {
  games: "Games.html",
  apps: "apps.html",
  vm: "vm/vm.html",
  hacks: "hax.html",
  partners: "partners.html"
};

// Overwrite the showSection function in main page script
window.showSection = function(section) {
  document.querySelectorAll('.content-frame').forEach(frame => frame.classList.remove('active'));
  document.getElementById('settings-section').classList.remove('active');
  if (section === 'home') {
    document.getElementById('home-section').classList.add('active');
  } else if (section === 'settings') {
    document.getElementById('settings-section').classList.add('active');
  } else if (section === 'proxy') {
    document.getElementById('proxy-section').classList.add('active');
  } else if (CDN_PAGE_MAPPINGS[section]) {
    const iframeId = `${section}-section`;
    const pageName = CDN_PAGE_MAPPINGS[section];
    document.getElementById(iframeId).classList.add('active');
    loadPageIntoIframe(iframeId, pageName);
  }
};

// Optionally, load the CDN loader script after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  // Initial load for home
  window.showSection('home');
});
