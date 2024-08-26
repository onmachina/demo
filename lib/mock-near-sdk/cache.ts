const CACHE_KEY_PREFIX = '@@nearauth@@';

export enum CacheKey {
  EMAIL = 'email',
  USER = 'user',
}

export interface ICache<T = any> {
  set(key: CacheKey, entry: T): void;
  get(key: CacheKey): T | undefined;
  remove(key: CacheKey): T | undefined;
  allKeys(): string[];
}

export class InMemoryCache implements ICache {
  private cache: Record<string, any> = {};

  public set(key: CacheKey, entry: any) {
    this.cache.setItem(CACHE_KEY_PREFIX + key, entry);
  }

  public get(key: string): any | undefined {
    return this.cache[CACHE_KEY_PREFIX + key];
  }

  public remove(key: string): any | undefined {
    const item = this.cache[CACHE_KEY_PREFIX + key];
    delete this.cache[CACHE_KEY_PREFIX + key];
    return item;
  }

  public allKeys() {
    return Object.keys(this.cache)
      .filter((key) => key.startsWith(CACHE_KEY_PREFIX))
      .map((key) => key.slice(CACHE_KEY_PREFIX.length));
  }
}

export class LocalStorageCache implements ICache {
  public set(key: string, entry: any) {
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(entry));
  }

  public get(key: string): any | undefined {
    const json = localStorage.getItem(CACHE_KEY_PREFIX + key);

    if (!json) return undefined;

    try {
      return JSON.parse(json);
    } catch (e) {
      return undefined;
    }
  }

  public remove(key: string): any | undefined {
    const item = this.get(key);
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
    return item;
  }

  public allKeys() {
    return Object.keys(window.localStorage)
      .filter((key) => key.startsWith(CACHE_KEY_PREFIX))
      .map((key) => key.slice(CACHE_KEY_PREFIX.length));
  }
}
