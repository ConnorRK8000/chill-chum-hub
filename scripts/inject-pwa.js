const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const htmlPath = path.join(dist, 'index.html');

let html = fs.readFileSync(htmlPath, 'utf8');

const inject = `
  <link rel="manifest" href="/manifest.json" />
  <link rel="apple-touch-icon" href="/icon-192.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Chill Chum Hub" />
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
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
