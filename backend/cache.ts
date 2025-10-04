// cache.js
import { Movie } from "../types/movie";

type CacheEntry = {
  data: Movie[];
  timestamp: number;
};

type CacheStore = {
  day: Record<number, CacheEntry>;
  week: Record<number, CacheEntry>;
};

const cache: CacheStore = { day: {}, week: {} };
  
  const CACHE_TTL = 3600000; // 1 hour (change if needed)
  
  export function setCache(type: keyof CacheStore, page: number, data: Movie[]): void {
    cache[type][page] = { data, timestamp: Date.now() };
  }
  
  export function getCache(type: 'day' | 'week', page: number): Movie[] | null {
    const entry = cache[type]?.[page];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      delete cache[type][page];
      return null;
    }
    return entry.data;
  }

  module.exports = { setCache, getCache };
  