// Team Coco Video Data Service
// Fetches from Cloudflare Worker proxy with aggressive local caching

const VIDEO_PROXY_URL = 'https://teamcoco-youtube-proxy.eam--oco--pp.workers.dev/latest';
const CACHE_KEY = 'teamcoco_latest_video';
const CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours local cache
const FETCH_TIMEOUT = 8000; // 8 second timeout

class VideoDataService {
  constructor() {
    this.cache = null;
    this.fetchPromise = null;
  }

  // Get latest video - returns cached immediately, updates in background
  async getLatestVideo() {
    // 1. Return cached data instantly (synchronous-ish)
    const cached = this.getCachedVideo();
    if (cached) {
      // Trigger background refresh (fire and forget)
      this.refreshInBackground();
      return cached;
    }

    // 2. No cache - fetch with timeout
    return this.fetchWithTimeout();
  }

  // Force refresh (pull-to-refresh, etc)
  async forceRefresh() {
    this.clearCache();
    return this.fetchWithTimeout();
  }

  // Fetch with timeout and error handling
  async fetchWithTimeout() {
    // Prevent duplicate simultaneous fetches
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      try {
        const response = await fetch(VIDEO_PROXY_URL, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.message || 'Proxy error');
        }

        // Validate required fields
        if (!data.videoId || !data.title) {
          throw new Error('Invalid video data');
        }

        // Cache the successful response
        this.setCachedVideo(data);
        return data;

      } catch (error) {
        clearTimeout(timeoutId);
        
        // Return cached data if fetch fails (stale-while-revalidate)
        const staleCache = this.getCachedVideo(true);
        if (staleCache) {
          console.warn('Using stale cache due to fetch error:', error.message);
          return { ...staleCache, _stale: true };
        }

        // No cache at all - return error object (not throwing to avoid UI crashes)
        return {
          error: true,
          message: error.name === 'AbortError' 
            ? 'Request timed out' 
            : 'Failed to load latest video',
          videoId: null
        };
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  // Background refresh without blocking UI
  refreshInBackground() {
    if (this.fetchPromise) return; // Already fetching
    
    // Small delay to not compete with critical resources
    setTimeout(() => {
      this.fetchWithTimeout().catch(() => {}); // Silent fail
    }, 100);
  }

  // LocalStorage cache with expiry
  getCachedVideo(allowStale = false) {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (!stored) return null;

      const { data, timestamp } = JSON.parse(stored);
      const age = Date.now() - timestamp;

      if (!allowStale && age > CACHE_EXPIRY) {
        this.clearCache();
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  setCachedVideo(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Storage full or unavailable - ignore
      console.warn('Failed to cache video:', e);
    }
  }

  clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {}
  }

  // Check if we have any cached data
  hasCache() {
    return !!this.getCachedVideo(true);
  }
}

// Export singleton
export const videoService = new VideoDataService();

// Helper: Format date for display
export function formatVideoDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Helper: Get embed URL from video ID
export function getEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

// Helper: Get YouTube deep link (opens native app on mobile)
export function getDeepLink(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// Helper: Create thumbnail URL with fallback chain
export function getThumbnailUrl(videoId, quality = 'maxresdefault') {
  const qualities = ['maxresdefault', 'hqdefault', 'mqdefault', 'default'];
  const idx = qualities.indexOf(quality);
  return `https://img.youtube.com/vi/${videoId}/${qualities[idx >= 0 ? idx : 0]}.jpg`;
}