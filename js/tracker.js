/**
 * Lightweight web usage tracker.
 * Distinguishes browser visits (pre-PWA conversion) from installed/standalone PWA.
 */
const TRACKER_ENDPOINT = (window.__TEAM_COCO_TRACKER_ENDPOINT__) || 'https://teamcoco-tracker-proxy.eam--oco--pp.workers.dev/collect';
const VISITOR_KEY = 'teamcoco_visitor_id';
const SESSION_KEY = 'teamcoco_visit_session';
const SESSION_TTL_MS = 30 * 60 * 1000;

function getDisplayMode() {
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  return 'browser';
}

function isStandalone() {
  return getDisplayMode() !== 'browser' || window.navigator.standalone === true;
}

function getOrCreateVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(16).slice(2);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function shouldCountVisit() {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const ts = parseInt(raw, 10);
      if (!Number.isNaN(ts) && (now - ts) < SESSION_TTL_MS) return false;
    }
    sessionStorage.setItem(SESSION_KEY, String(now));
    return true;
  } catch {
    return true;
  }
}

function getPlatform() {
  const ua = navigator.userAgent || '';
  const displayMode = getDisplayMode();
  const standalone = isStandalone();
  const surface = standalone ? 'web-pwa' : 'web-browser';
  let os = 'unknown';
  if (/android/i.test(ua)) os = 'android';
  else if (/iPad|iPhone|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) os = 'ios';
  else if (/Win/i.test(ua)) os = 'windows';
  else if (/Mac/i.test(ua)) os = 'macos';
  else if (/Linux/i.test(ua)) os = 'linux';
  return { surface, displayMode, standalone, os };
}

function send(eventName, extra = {}) {
  const payload = {
    event: eventName,
    visitorId: getOrCreateVisitorId(),
    ts: new Date().toISOString(),
    path: (location.pathname || '/') + (location.search || ''),
    referrer: document.referrer ? new URL(document.referrer, location.href).origin : null,
    ...getPlatform(),
    ...extra,
  };
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(TRACKER_ENDPOINT, blob)) return;
    }
  } catch {}
  try {
    fetch(TRACKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      mode: 'cors',
      credentials: 'omit',
    }).catch(() => {});
  } catch {}
}

export function trackWebVisit() {
  if (typeof window === 'undefined') return;
  if (!shouldCountVisit()) return;
  send('visit', { preConversion: !isStandalone() });
}

export function trackInstallPromptShown() {
  send('install_prompt_shown', { preConversion: true });
}

export function trackPwaInstalled() {
  send('pwa_installed', { preConversion: false });
}

export function initWebTracker() {
  if (typeof window === 'undefined') return;
  try {
    if (document.visibilityState === 'prerender') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') trackWebVisit();
      }, { once: true });
    } else {
      trackWebVisit();
    }
    window.addEventListener('appinstalled', () => trackPwaInstalled());
  } catch {}
}
