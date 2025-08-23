// CDN Page Loader for ZXS Games
// Loads page content from jsdelivr CDN, extracts <body>, <style>, and <script>, and displays in the iframe.

const CDN_PREFIX = "https://cdn.jsdelivr.net/gh/Darkdragonzxs/ZXS-games@main/assets/pages/";

function loadPageIntoIframe(iframeId, pageName) {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;

  fetch(CDN_PREFIX + pageName)
    .then(res => res.text())
    .then(html => {
      // Extract <body> content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : html;

      // Extract <style> tags
      const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
      const styleContent = styleMatches.map(m => m[1]).join("\n");

      // Extract <script> tags
      const scriptMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
      const scriptContent = scriptMatches.map(m => m[1]).join("\n");

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
            <script>
              try { ${scriptContent} } catch(e) { console.error("CDN iframe script error:", e); }
            </script>
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

// Initial load for home
document.addEventListener('DOMContentLoaded', function() {
  window.showSection('home');
});
