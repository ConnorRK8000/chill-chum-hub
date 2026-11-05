// Team Coco Merch Data Service
// Fetches from Cloudflare Worker proxy with local caching

const MERCH_PROXY_URL = 'https://teamcoco-merch-proxy.eam--oco--pp.workers.dev/merch';
const CACHE_KEY = 'teamcoco_merch';
const CACHE_EXPIRY = 1000 * 60 * 60 * 6; // 6 hours local cache
const FETCH_TIMEOUT = 8000;

// Fallback merch data (top 5 from PodSwag Team Coco collection)
const fallbackMerchData = [
  {
    id: 'ps-7271413743658',
    name: "Conan O'Brien Needs A Friend: Doodle Hat",
    price: 30.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/classic-dad-hat-black-front-6634f610c9082.jpg?v=1734030743',
    category: 'accessories',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-doodle-hat',
  },
  {
    id: 'ps-7310059208746',
    name: "Conan O'Brien Needs A Friend x Club None: Official Friend Mug",
    price: 15.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/white-glossy-mug-white-11-oz-handle-on-right-664dff50616b3.jpg?v=1734030740',
    category: 'collectibles',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-official-friend-mug',
  },
  {
    id: 'ps-7310059077674',
    name: "Conan O'Brien Needs A Friend x Club None: Official Friend Sticker Sheet",
    price: 8.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/kiss-cut-sticker-sheet-white-front-664dfeef88f29.jpg?v=1734030742',
    category: 'collectibles',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-official-friend-sticker-sheet',
  },
  {
    id: 'ps-7266373140522',
    name: "Conan O'Brien Needs A Friend: Quinquennial Celebration Exclusive LP",
    price: 35.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/CONAF_5YearAnniversary_2ndPress_Gatefold.png?v=1734030746',
    category: 'collectibles',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-quinquennial-celebration-exclusive-lp-2nd-pressing',
  },
  {
    id: 'ps-7424040665130',
    name: "Conan O'Brien Needs A Friend: Classic Logo Tee",
    price: 30.00,
    image: 'https://cdn.shopify.com/s/files/1/1850/0373/files/unisex-staple-t-shirt-heather-deep-teal-front-66a96df6b24c4.jpg?v=1734030725',
    category: 'apparel',
    url: 'https://www.podswag.com/collections/team-coco/products/conan-obrien-needs-a-friend-classic-logo-tee',
  },
];

class MerchDataService {
  constructor() {
    this.fetchPromise = null;
  }

  async getMerch() {
    console.log('[MerchService] Getting merch...');
    const cached = this.getCachedMerch();
    if (cached && cached.length > 0) {
      console.log('[MerchService] Returning cached merch:', cached.length);
      this.refreshInBackground();
      return cached;
    }

    return this.fetchWithTimeout();
  }

  async forceRefresh() {
    console.log('[MerchService] Force refresh');
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
        console.log('[MerchService] Fetching from:', MERCH_PROXY_URL);
        const response = await fetch(MERCH_PROXY_URL, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });

        clearTimeout(timeoutId);
        console.log('[MerchService] Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('[MerchService] Response data:', data);

        if (data.error) {
          throw new Error(data.message || 'Proxy error');
        }

        if (!Array.isArray(data.products)) {
          throw new Error('Invalid merch data');
        }

        // Treat empty array as error to trigger fallback
        if (data.products.length === 0) {
          throw new Error('Empty products from proxy');
        }

        console.log('[MerchService] Got', data.products.length, 'products');
        this.setCachedMerch(data.products);
        return data.products;

      } catch (error) {
        clearTimeout(timeoutId);
        console.error('[MerchService] Fetch error:', error);
        
        const staleCache = this.getCachedMerch(true);
        if (staleCache && staleCache.length > 0) {
          console.warn('[MerchService] Using stale cache due to fetch error:', error.message);
          return staleCache;
        }

        // Return fallback data on any error or empty result
        console.warn('[MerchService] Using fallback data');
        return fallbackMerchData;
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

  getCachedMerch(allowStale = false) {
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

  setCachedMerch(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('[MerchService] Failed to cache merch:', e);
    }
  }

  clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {}
  }

  hasCache() {
    return !!this.getCachedMerch(true);
  }
}

export const merchService = new MerchDataService();