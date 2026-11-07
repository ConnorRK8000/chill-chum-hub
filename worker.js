export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }
    
    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    // Cache key
    const cacheKey = new Request('https://teamcoco-proxy.workers.dev/latest-v2', request);
    const cache = caches.default;
    
    // Try to get from cache first
    let response = await cache.match(cacheKey);
    
    if (!response) {
      // Fetch from YouTube RSS
      response = await fetchYouTubeRSS();
      
      if (response.ok) {
        // Clone response for caching
        const responseToCache = response.clone();
        
        // Cache for 15 minutes (900 seconds)
        ctx.waitUntil(cache.put(cacheKey, responseToCache));
      }
    }
    
    // Add CORS headers
    return addCORSHeaders(response);
  }
};

async function fetchYouTubeRSS() {
  const channelUrl = 'https://www.youtube.com/@TeamCoco/videos';
  
  try {
    const response = await fetch(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      throw new Error(`Channel page fetch failed: ${response.status}`);
    }
    
    const html = await response.text();
    const videoData = parseYouTubeChannel(html);
    
    if (!videoData) {
      throw new Error('No video data found on channel page');
    }
    
    return new Response(JSON.stringify(videoData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800'
      }
    });
  } catch (error) {
    console.error('Channel scrape error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch latest video',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function parseYouTubeChannel(html) {
  // Find all videoIds; skip YouTube's own UI videos (e.g. keyboard shortcuts)
  const matches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
  const seen = new Set();
  const ids = [];
  for (const m of matches) {
    const id = m[1];
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  // The first unique id is usually a YouTube UI element; skip it
  const videoId = ids.length > 1 ? ids[1] : (ids[0] || null);
  if (!videoId) return null;
  
  // Try to extract title near this videoId
  let title = 'Latest Team Coco Upload';
  const idx = html.indexOf(videoId);
  const snippet = html.substring(Math.max(0, idx - 300), idx + 300);
  const titleMatch = snippet.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
  if (titleMatch) title = titleMatch[1];
  
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  return {
    videoId,
    title,
    publishedAt: new Date().toISOString(),
    videoUrl,
    thumbnailUrl
  };
}

function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

function addCORSHeaders(response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}