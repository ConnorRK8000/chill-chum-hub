/**
 * Cloudflare Worker: Team Coco usage tracker
 * Collects web visit events (browser vs PWA/standalone) for usage monitoring.
 * Bind a KV namespace as TRACKER_KV to persist aggregates.
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return corsResponse(env, null, 204);
    }

    if (url.pathname === '/collect' && request.method === 'POST') {
      return handleCollect(request, env, ctx);
    }

    if (url.pathname === '/stats' && request.method === 'GET') {
      return handleStats(request, env);
    }

    if (url.pathname === '/health' && request.method === 'GET') {
      return corsJson(env, { ok: true, service: 'teamcoco-tracker' }, 200);
    }

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      return dashboardResponse();
    }

    return corsJson(env, { error: 'Not found' }, 404);
  }
};

async function handleCollect(request, env, ctx) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return corsJson(env, { error: 'Invalid JSON' }, 400);
  }

  const event = typeof payload.event === 'string' ? payload.event.slice(0, 64) : 'unknown';
  const surface = typeof payload.surface === 'string' ? payload.surface.slice(0, 32) : 'unknown';
  const displayMode = typeof payload.displayMode === 'string' ? payload.displayMode.slice(0, 32) : 'unknown';
  const os = typeof payload.os === 'string' ? payload.os.slice(0, 32) : 'unknown';
  const preConversion = payload.preConversion === true;
  const visitorId = typeof payload.visitorId === 'string' ? payload.visitorId.slice(0, 80) : null;
  const day = new Date().toISOString().slice(0, 10);

  const record = {
    event,
    surface,
    displayMode,
    os,
    preConversion,
    day,
    path: typeof payload.path === 'string' ? payload.path.slice(0, 200) : null,
    ts: new Date().toISOString(),
  };

  ctx.waitUntil(recordEvent(env, record, visitorId));

  return corsJson(env, { ok: true }, 202);
}

async function recordEvent(env, record, visitorId) {
  if (!env.TRACKER_KV) return;

  const day = record.day;
  const keys = [
    `agg:${day}:total`,
    `agg:${day}:event:${record.event}`,
    `agg:${day}:surface:${record.surface}`,
    `agg:${day}:mode:${record.displayMode}`,
    `agg:${day}:preconv:${record.preConversion ? 'true' : 'false'}`,
  ];

  const ops = keys.map((k) => incrementKey(env.TRACKER_KV, k));
  if (visitorId) {
    const uvKey = `uv:${day}:${visitorId}`;
    const seen = await env.TRACKER_KV.get(uvKey);
    if (!seen) {
      ops.push(env.TRACKER_KV.put(uvKey, '1', { expirationTtl: 60 * 60 * 24 * 2 }));
      ops.push(incrementKey(env.TRACKER_KV, `agg:${day}:unique_visitors`));
      if (record.preConversion) ops.push(incrementKey(env.TRACKER_KV, `agg:${day}:unique_browser_pre_conversion`));
    }
  }

  await Promise.all(ops);
}

async function incrementKey(kv, key) {
  const current = parseInt((await kv.get(key)) || '0', 10);
  const next = (Number.isNaN(current) ? 0 : current) + 1;
  await kv.put(key, String(next), { expirationTtl: 60 * 60 * 24 * 400 });
}

async function handleStats(request, env) {
  if (!env.TRACKER_KV) {
    return corsJson(env, { error: 'TRACKER_KV not configured' }, 503);
  }
  const url = new URL(request.url);
  const day = (url.searchParams.get('day') || new Date().toISOString().slice(0, 10)).slice(0, 10);
  const names = [
    'total', 'unique_visitors', 'unique_browser_pre_conversion',
    'event:visit', 'event:install_prompt_shown', 'event:pwa_installed',
    'surface:web-browser', 'surface:web-pwa',
    'mode:browser', 'mode:standalone', 'mode:fullscreen', 'mode:minimal-ui',
    'preconv:true', 'preconv:false',
  ];
  const entries = await Promise.all(names.map(async (n) => [n, parseInt((await env.TRACKER_KV.get(`agg:${day}:${n}`)) || '0', 10)]));
  const stats = Object.fromEntries(entries);
  return corsJson(env, { day, stats }, 200);
}

function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function corsJson(env, obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(env),
    },
  });
}

function corsResponse(env, body, status) {
  return new Response(body, { status, headers: corsHeaders(env) });
}

function dashboardResponse() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Usage Tracker</title>
<style>
  :root{--bg:#0f1115;--card:#171a21;--text:#e8eaed;--muted:#9aa0a6;--accent:#FF6B00;--green:#34a853}
  *{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--text)}
  .wrap{max-width:980px;margin:0 auto;padding:20px}
  h1{margin:0 0 4px;font-size:20px;font-weight:600} .sub{color:var(--muted);font-size:13px;margin-bottom:18px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
  .card{background:var(--card);border:1px solid #262a33;border-radius:10px;padding:14px}
  .label{font-size:12px;color:var(--muted);margin-bottom:6px} .value{font-size:28px;font-weight:700;line-height:1.1}
  .card.highlight{border-color:rgba(255,107,0,.5);box-shadow:0 0 0 1px rgba(255,107,0,.15) inset}
  .card.highlight .value{color:var(--accent)}
  .row{display:flex;gap:8px;align-items:center;margin-top:14px;flex-wrap:wrap}
  .pill{font-size:12px;color:var(--muted);background:#1f2430;padding:4px 10px;border-radius:999px}
  .ok{color:var(--green)} .err{color:#ea4335}
</style>
</head>
<body>
<div class="wrap">
  <h1>Usage Tracker</h1>
  <div class="sub">Auto-refreshes every 10s · Day: <span id="day">-</span> · <span id="status" class="pill">Loading…</span></div>
  <div class="grid">
    <div class="card highlight"><div class="label">Browser visits (pre-PWA)</div><div class="value" id="browserVisits">-</div></div>
    <div class="card highlight"><div class="label">Unique browser visitors (pre-PWA)</div><div class="value" id="uniqueBrowser">-</div></div>
    <div class="card"><div class="label">Total events</div><div class="value" id="total">-</div></div>
    <div class="card"><div class="label">Unique visitors</div><div class="value" id="unique">-</div></div>
    <div class="card"><div class="label">Visit events</div><div class="value" id="visits">-</div></div>
    <div class="card"><div class="label">PWA/standalone visits</div><div class="value" id="pwaVisits">-</div></div>
    <div class="card"><div class="label">Install prompt shown</div><div class="value" id="prompts">-</div></div>
    <div class="card"><div class="label">PWA installed</div><div class="value" id="installed">-</div></div>
  </div>
  <div class="row"><span class="pill">Surface: browser <b id="sBrowser">-</b></span><span class="pill">web-pwa <b id="sPwa">-</b></span><span class="pill">Mode: browser <b id="mBrowser">-</b> · standalone <b id="mStandalone">-</b></span></div>
</div>
<script>
(function(){
  var set = function(id,v){ var el=document.getElementById(id); if(el) el.textContent = (v==null?'-':v); };
  function load(){
    var day = new Date().toISOString().slice(0,10);
    fetch('/stats?day='+encodeURIComponent(day), {cache:'no-store'})
      .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
      .then(function(d){
        var s=d.stats||{};
        set('day', d.day||day);
        set('browserVisits', s['preconv:true']||0);
        set('uniqueBrowser', s['unique_browser_pre_conversion']||0);
        set('total', s['total']||0);
        set('unique', s['unique_visitors']||0);
        set('visits', s['event:visit']||0);
        set('pwaVisits', s['preconv:false']||0);
        set('prompts', s['event:install_prompt_shown']||0);
        set('installed', s['event:pwa_installed']||0);
        set('sBrowser', s['surface:web-browser']||0);
        set('sPwa', s['surface:web-pwa']||0);
        set('mBrowser', s['mode:browser']||0);
        set('mStandalone', s['mode:standalone']||0);
        var st=document.getElementById('status'); if(st){ st.textContent='Updated '+new Date().toLocaleTimeString(); st.className='pill ok'; }
      })
      .catch(function(e){
        var st=document.getElementById('status'); if(st){ st.textContent='Error: '+e.message; st.className='pill err'; }
      });
  }
  load();
  setInterval(load, 10000);
})();
</script>
</body></html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
