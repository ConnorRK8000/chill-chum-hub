const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');
const htmlPath = path.join(dist, 'index.html');

let html = fs.readFileSync(htmlPath, 'utf8');

const BASE = '/chill-chum-hub';

const inject = `
  <link rel="manifest" href="${BASE}/manifest.json" />
  <link rel="apple-touch-icon" href="${BASE}/icon-192.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Chill Chum Hub" />
  <link rel="stylesheet" href="${BASE}/install-prompt.css" />
  <script src="${BASE}/install-prompt.js" defer></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('${BASE}/sw.js').then(function(reg) {
          console.log('SW registered:', reg.scope);
        }).catch(function(err) {
          console.log('SW registration failed:', err);
        });
      });
    }
  </script>
`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', inject + '\n</head>');
  fs.writeFileSync(htmlPath, html);
  console.log('PWA tags injected into index.html');
} else {
  console.log('PWA tags already present');
}

// Ensure install prompt assets exist in dist (Expo export copies public/, but be defensive)
['install-prompt.js', 'install-prompt.css'].forEach((file) => {
  const src = path.join(publicDir, file);
  const dest = path.join(dist, file);
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log('Copied', file, 'to dist');
  }
});

