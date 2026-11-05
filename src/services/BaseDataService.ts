import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface ServiceConfig {
  proxyUrl: string;
  cacheKey: string;
  cacheExpiry: number;
  fetchTimeout: number;
}

export abstract class BaseDataService<T, E = T> {
  protected config: ServiceConfig;
  protected fetchPromise: Promise<T> | null = null;

  constructor(config: ServiceConfig) {
    this.config = config;
  }

  async getData(): Promise<T> {
    const cached = await this.getCachedData();
    if (cached) {
      this.refreshInBackground();
      return cached;
    }
    return this.fetchWithTimeout();
  }

  async forceRefresh(): Promise<T> {
    this.clearCache();
    return this.fetchWithTimeout();
  }

  protected async fetchWithTimeout(): Promise<T> {
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.fetchTimeout);

      try {
        const response = await fetch(this.config.proxyUrl, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.message || 'Proxy error');
        }

        const validatedData = this.validateData(data);
        this.setCachedData(validatedData);
        return validatedData;
      } catch (error) {
        clearTimeout(timeoutId);

        const staleCache = await this.getCachedData(true);
        if (staleCache) {
          console.warn(`Using stale cache due to fetch error: ${error}`);
          return staleCache;
        }

        throw error;
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  protected refreshInBackground(): void {
    if (this.fetchPromise) return;

    setTimeout(() => {
      this.fetchWithTimeout().catch(() => {});
    }, 100);
  }

  protected async getCachedData(allowStale = false): Promise<T | null> {
    try {
      const stored = await AsyncStorage.getItem(this.config.cacheKey);
      if (!stored) return null;

      const { data, timestamp }: CacheEntry<T> = JSON.parse(stored);
      const age = Date.now() - timestamp;

      if (!allowStale && age > this.config.cacheExpiry) {
        this.clearCache();
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  protected setCachedData(data: T): void {
    try {
      AsyncStorage.setItem(this.config.cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {
      console.warn(`Failed to cache data for ${this.config.cacheKey}:`, e);
    }
  }

  protected clearCache(): void {
    try {
      AsyncStorage.removeItem(this.config.cacheKey);
    } catch {}
  }

  protected async hasCache(): Promise<boolean> {
    return !!await this.getCachedData(true);
  }

  protected abstract validateData(data: any): T;
  protected abstract getErrorResponse(error: any): E;
}