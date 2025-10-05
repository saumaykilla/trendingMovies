// cache.test.ts
import { setCache, getCache, clearCache } from '../cache';
import { Movie } from '../../types/movie';

// Mock movie data
const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Test Movie 1',
    overview: 'A test movie',
    poster_path: '/test1.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    adult: false,
    backdrop_path: '/backdrop1.jpg',
    original_language: 'en',
    original_title: 'Test Movie 1',
    genre_ids: [18],
    popularity: 10.0,
    video: false,
    vote_count: 100,
    media_type: 'movie',
  },
  {
    id: 2,
    title: 'Test Movie 2',
    overview: 'Another test movie',
    poster_path: '/test2.jpg',
    release_date: '2024-01-02',
    vote_average: 7.5,
    adult: false,
    backdrop_path: '/backdrop2.jpg',
    original_language: 'en',
    original_title: 'Test Movie 2',
    genre_ids: [28, 12],
    popularity: 8.5,
    video: false,
    vote_count: 85,
    media_type: 'movie',
  },
];

describe('Cache Module', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearCache();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('setCache', () => {
    it('should store data in cache for day type', () => {
      setCache('day', 1, mockMovies);
      const result = getCache('day', 1);
      expect(result).toEqual(mockMovies);
    });

    it('should store data in cache for week type', () => {
      setCache('week', 1, mockMovies);
      const result = getCache('week', 1);
      expect(result).toEqual(mockMovies);
    });

    it('should store data for different pages separately', () => {
      const page1Movies = [mockMovies[0]];
      const page2Movies = [mockMovies[1]];

      setCache('day', 1, page1Movies);
      setCache('day', 2, page2Movies);

      expect(getCache('day', 1)).toEqual(page1Movies);
      expect(getCache('day', 2)).toEqual(page2Movies);
    });

    it('should overwrite existing cache for same type and page', () => {
      const newMovies: Movie[] = [
        {
          id: 3,
          title: 'New Movie',
          overview: 'Updated data',
          poster_path: '/new.jpg',
          release_date: '2024-01-03',
          vote_average: 9.0,
          adult: false,
          backdrop_path: '',
          original_language: 'en',
          original_title: 'New Movie',
          genre_ids: [],
          popularity: 0,
          video: false,
          vote_count: 0,
          media_type: 'movie',
        },
      ];

      setCache('day', 1, mockMovies);
      setCache('day', 1, newMovies);

      expect(getCache('day', 1)).toEqual(newMovies);
    });
  });

  describe('getCache', () => {
    it('should return null for non-existent cache', () => {
      const result = getCache('day', 999);
      expect(result).toBeNull();
    });

    it('should return null for different cache type', () => {
      setCache('day', 1, mockMovies);
      const result = getCache('week', 1);
      expect(result).toBeNull();
    });

    it('should return cached data within TTL', () => {
      setCache('day', 1, mockMovies);
      const result = getCache('day', 1);
      expect(result).toEqual(mockMovies);
    });

    it('should return null for expired cache', () => {
      jest.useFakeTimers();
      
      setCache('day', 1, mockMovies);
      
      // Fast-forward time past TTL (1 hour + 1ms)
      jest.advanceTimersByTime(3600001);
      
      const result = getCache('day', 1);
      expect(result).toBeNull();
      
      jest.useRealTimers();
    });

    it('should delete expired cache entry', () => {
      jest.useFakeTimers();
      
      setCache('day', 1, mockMovies);
      jest.advanceTimersByTime(3600001);
      
      // First call should return null and delete entry
      getCache('day', 1);
      
      // Reset time and check that entry is still gone
      jest.useRealTimers();
      const result = getCache('day', 1);
      expect(result).toBeNull();
    });

    it('should handle cache at exact TTL boundary', () => {
      jest.useFakeTimers();
      
      setCache('day', 1, mockMovies);
      
      // Fast-forward to exactly TTL (should be expired since condition is >)
      jest.advanceTimersByTime(3600000);
      
      const result = getCache('day', 1);
      // At exactly TTL, the cache should still be valid (> not >=)
      expect(result).toEqual(mockMovies);
      
      jest.useRealTimers();
    });
  });

  describe('Cache isolation', () => {
    it('should keep day and week caches separate', () => {
      const dayMovies = [mockMovies[0]];
      const weekMovies = [mockMovies[1]];

      setCache('day', 1, dayMovies);
      setCache('week', 1, weekMovies);

      expect(getCache('day', 1)).toEqual(dayMovies);
      expect(getCache('week', 1)).toEqual(weekMovies);
    });

    it('should handle multiple pages across different types', () => {
      setCache('day', 1, mockMovies);
      setCache('day', 2, mockMovies);
      setCache('week', 1, mockMovies);
      setCache('week', 2, mockMovies);

      expect(getCache('day', 1)).toEqual(mockMovies);
      expect(getCache('day', 2)).toEqual(mockMovies);
      expect(getCache('week', 1)).toEqual(mockMovies);
      expect(getCache('week', 2)).toEqual(mockMovies);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty movie array', () => {
      setCache('day', 1, []);
      const result = getCache('day', 1);
      expect(result).toEqual([]);
    });

    it('should handle page 0', () => {
      setCache('day', 0, mockMovies);
      const result = getCache('day', 0);
      expect(result).toEqual(mockMovies);
    });

    it('should handle negative page numbers', () => {
      setCache('day', -1, mockMovies);
      const result = getCache('day', -1);
      expect(result).toEqual(mockMovies);
    });

    it('should handle large page numbers', () => {
      setCache('day', 999999, mockMovies);
      const result = getCache('day', 999999);
      expect(result).toEqual(mockMovies);
    });
  });
});