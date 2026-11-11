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
  <script>
    (function(){
      var ENDPOINT = (window.__TEAM_COCO_TRACKER_ENDPOINT__) || 'https://teamcoco-tracker-proxy.eam--oco--pp.workers.dev/collect';
      var VISITOR_KEY = 'teamcoco_visitor_id';
      var SESSION_KEY = 'teamcoco_visit_session';
      var SESSION_TTL_MS = 30 * 60 * 1000;
      function getDisplayMode(){
        if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
        if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
        if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
        return 'browser';
      }
      function isStandalone(){ return getDisplayMode() !== 'browser' || window.navigator.standalone === true; }
      function getOrCreateVisitorId(){
        try { var id = localStorage.getItem(VISITOR_KEY); if (!id){ id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now())+'-'+Math.random().toString(16).slice(2); localStorage.setItem(VISITOR_KEY,id);} return id; } catch(e){ return null; }
      }
      function shouldCountVisit(){
        try { var now=Date.now(); var raw=sessionStorage.getItem(SESSION_KEY); if(raw){ var ts=parseInt(raw,10); if(!isNaN(ts) && (now-ts)<SESSION_TTL_MS) return false; } sessionStorage.setItem(SESSION_KEY,String(now)); return true; } catch(e){ return true; }
      }
      function getPlatform(){
        var ua=navigator.userAgent||''; var mode=getDisplayMode(); var st=isStandalone(); var os='unknown';
        if(/android/i.test(ua)) os='android'; else if(/iPad|iPhone|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)) os='ios'; else if(/Win/i.test(ua)) os='windows'; else if(/Mac/i.test(ua)) os='macos'; else if(/Linux/i.test(ua)) os='linux';
        return { surface: st ? 'web-pwa' : 'web-browser', displayMode: mode, standalone: st, os: os };
      }
      function send(eventName, extra){
        var p=getPlatform();
        var payload=Object.assign({ event:eventName, visitorId:getOrCreateVisitorId(), ts:new Date().toISOString(), path:(location.pathname||'/')+(location.search||''), referrer: document.referrer ? (function(){try{return new URL(document.referrer,location.href).origin;}catch(e){return null;}})() : null, preConversion: !p.standalone }, p, extra||{});
        var body=JSON.stringify(payload);
        try { if(navigator.sendBeacon){ var blob=new Blob([body],{type:'application/json'}); if(navigator.sendBeacon(ENDPOINT,blob)) return; } } catch(e){}
        try { fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:body,keepalive:true,mode:'cors',credentials:'omit'}).catch(function(){}); } catch(e){}
      }
      function trackVisit(){ if(!shouldCountVisit()) return; send('visit'); }
      try {
        if(document.visibilityState==='prerender'){ document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='visible') trackVisit(); },{once:true}); } else { trackVisit(); }
        window.addEventListener('appinstalled', function(){ send('pwa_installed',{preConversion:false}); });
      } catch(e){}
    })();
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

