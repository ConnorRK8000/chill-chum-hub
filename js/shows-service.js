// Team Coco Shows Data Service
// Fetches from Cloudflare Worker proxy with aggressive local caching

const SHOWS_PROXY_URL = 'https://teamcoco-shows-proxy.eam--oco--pp.workers.dev/shows';
const CACHE_KEY = 'teamcoco_shows';
const CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours local cache
const FETCH_TIMEOUT = 8000; // 8 second timeout

class ShowsDataService {
  constructor() {
    this.fetchPromise = null;
  }

  async getShows() {
    console.log('[ShowsService] Getting shows...');
    const cached = this.getCachedShows();
    if (cached && cached.length > 0) {
      console.log('[ShowsService] Returning cached shows:', cached.length);
      this.refreshInBackground();
      return cached;
    }

    return this.fetchWithTimeout();
  }

  async forceRefresh() {
    console.log('[ShowsService] Force refresh');
    this.clearCache();
    return this.fetchWithTimeout();
  }

  async fetchWithTimeout() {
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      try {
        console.log('[ShowsService] Fetching from:', SHOWS_PROXY_URL);
        const response = await fetch(SHOWS_PROXY_URL, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });

        clearTimeout(timeoutId);
        console.log('[ShowsService] Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('[ShowsService] Response data:', data);

        if (data.error) {
          throw new Error(data.message || 'Proxy error');
        }

        if (!Array.isArray(data.shows)) {
          throw new Error('Invalid shows data');
        }

        // Return whatever the worker returns (including empty array for no upcoming shows)
        console.log('[ShowsService] Got', data.shows.length, 'shows');
        if (data.shows.length > 0) {
          this.setCachedShows(data.shows);
        }
        return data.shows;

      } catch (error) {
        clearTimeout(timeoutId);
        console.error('[ShowsService] Fetch error:', error);
        
        const staleCache = this.getCachedShows(true);
        if (staleCache && staleCache.length > 0) {
          console.warn('[ShowsService] Using stale cache due to fetch error:', error.message);
          return staleCache;
        }

        // Return empty array on error - no fallback placeholder data
        console.warn('[ShowsService] No shows data available');
        return [];
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  refreshInBackground() {
    if (this.fetchPromise) return;
    
    setTimeout(() => {
      this.fetchWithTimeout().catch(() => {});
    }, 100);
  }

  getCachedShows(allowStale = false) {
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

  setCachedShows(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('[ShowsService] Failed to cache shows:', e);
    }
  }

  clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {}
  }

  hasCache() {
    return !!this.getCachedShows(true);
  }
}

export const showsService = new ShowsDataService();