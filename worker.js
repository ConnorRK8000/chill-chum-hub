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
    const cacheKey = new Request('https://teamcoco-proxy.workers.dev/latest', request);
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
  const channelId = 'UCi7GJNg51C3jgmYTUwqoUXA';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  
  try {
    const rssResponse = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'TeamCocoApp/1.0 (+https://teamcoco.app)'
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000)
    });
    
    if (!rssResponse.ok) {
      throw new Error(`YouTube RSS fetch failed: ${rssResponse.status}`);
    }
    
    const xmlText = await rssResponse.text();
    const videoData = parseYouTubeRSS(xmlText);
    
    if (!videoData) {
      throw new Error('No video data found in RSS feed');
    }
    
    return new Response(JSON.stringify(videoData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800'
      }
    });
  } catch (error) {
    console.error('RSS fetch error:', error);
    
    // Return cached fallback or error
    return new Response(JSON.stringify({
      error: 'Failed to fetch latest video',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function parseYouTubeRSS(xml) {
  // Simple regex-based parsing (no DOMParser needed)
  // Find first <entry>...</entry>
  const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
  if (!entryMatch) return null;
  
  const entry = entryMatch[1];
  
  // Extract video ID from yt:videoId
  let videoId = '';
  const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || 
                       entry.match(/<videoId>([^<]+)<\/videoId>/);
  if (videoIdMatch) {
    videoId = videoIdMatch[1].trim();
  } else {
    // Fallback: extract from link
    const linkMatch = entry.match(/<link[^>]*href="([^"]*[?&]v=([^&"]+))"/);
    if (linkMatch) videoId = linkMatch[2];
  }
  
  // Extract title
  const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].trim().replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') : 'Untitled';
  
  // Extract published date
  const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
  const publishedAt = publishedMatch ? publishedMatch[1].trim() : new Date().toISOString();
  
  // Extract thumbnail from media:thumbnail
  let thumbnailUrl = '';
  const thumbMatch = entry.match(/<media:thumbnail[^>]*url="([^"]*(?:maxresdefault|hqdefault)[^"]*)"/);
  if (thumbMatch) {
    thumbnailUrl = thumbMatch[1];
  }
  
  // Fallback thumbnail URLs
  if (!thumbnailUrl && videoId) {
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';
  
  return {
    videoId,
    title,
    publishedAt,
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