// trendingMovieService.test.ts
import { Request, Response } from 'express';
import { trendingMovieService } from '../controller/trendingMovieService';
import { getCache, setCache } from '../cache';
import { Movie } from '../../types/movie';

// Mock the cache module
jest.mock('../cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  clearCache: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('trendingMovieService', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const mockMovieData = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Test Movie',
        overview: 'A test movie',
        poster_path: '/test.jpg',
        release_date: '2024-01-01',
        vote_average: 8.5,
        adult: false,
        backdrop_path: '/backdrop.jpg',
        original_language: 'en',
        original_title: 'Test Movie',
        genre_ids: [18],
        popularity: 10.0,
        video: false,
        vote_count: 100,
        media_type: 'movie',
      },
    ] as Movie[],
    total_pages: 100,
    total_results: 2000,
  };

  beforeEach(() => {
    // Setup mock request and response
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      params: {},
      query: {},
    };

    mockRes = {
      json: jsonMock,
      status: statusMock,
    };

    // Clear all mocks
    jest.clearAllMocks();

    // Setup environment variable
    process.env.api_key = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.api_key;
  });

  describe('Validation', () => {
    it('should return 400 if time_window is missing', async () => {
      mockReq.params = {};
      mockReq.query = { page: '1' };

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Query param "type" is required and must be "day" or "week"',
      });
    });

    it('should return 400 if time_window is invalid', async () => {
      mockReq.params = { time_window: 'month' };
      mockReq.query = { page: '1' };

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Query param "type" is required and must be "day" or "week"',
      });
    });

    it('should return 400 if page is not a number', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: 'invalid' };

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Query param "page" must be a positive integer',
      });
    });

    it('should return 400 if page is less than 1', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '0' };

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Query param "page" must be a positive integer',
      });
    });

    it('should return 400 if page is negative', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '-1' };

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Query param "page" must be a positive integer',
      });
    });

    it('should return 500 if API key is missing', async () => {
      delete process.env.api_key;
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Missing TMDB API key',
      });
    });
  });

  describe('Cache', () => {
    it('should return cached data if available', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (getCache as jest.Mock).mockReturnValue(mockMovieData.results);

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(getCache).toHaveBeenCalledWith('day', 1);
      expect(jsonMock).toHaveBeenCalledWith(mockMovieData.results);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle week time_window for cache', async () => {
      mockReq.params = { time_window: 'week' };
      mockReq.query = { page: '2' };

      (getCache as jest.Mock).mockReturnValue(mockMovieData.results);

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(getCache).toHaveBeenCalledWith('week', 2);
      expect(jsonMock).toHaveBeenCalledWith(mockMovieData.results);
    });
  });

  describe('API Fetch', () => {
    beforeEach(() => {
      (getCache as jest.Mock).mockReturnValue(null);
    });

    it('should fetch data from TMDB API when cache is empty', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/trending/movie/day?page=1',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer test-api-key',
          },
        }
      );
    });

    it('should cache the fetched data', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(setCache).toHaveBeenCalledWith('day', 1, mockMovieData);
    });

    it('should return fetched data', async () => {
      mockReq.params = { time_window: 'week' };
      mockReq.query = { page: '3' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockMovieData);
    });

    it('should handle different page numbers', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '5' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/trending/movie/day?page=5',
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      (getCache as jest.Mock).mockReturnValue(null);
    });

    it('should handle TMDB API errors', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          status_message: 'Invalid API key',
          status_code: 7,
        }),
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Invalid API key',
      });
    });

    it('should handle TMDB API errors without status_message', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'TMDB API error',
      });
    });

    it('should handle invalid data format from TMDB', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(502);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Invalid data format from TMDB',
      });
    });

    it('should handle missing results array', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ page: 1, total_pages: 100 }),
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(502);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Invalid data format from TMDB',
      });
    });

    it('should handle network errors', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch trending movies',
      });
    });

    it('should handle fetch timeout', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (fetch as jest.Mock).mockRejectedValue(new Error('Timeout'));

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch trending movies',
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete flow: miss cache, fetch, cache, return', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (getCache as jest.Mock).mockReturnValue(null);
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(getCache).toHaveBeenCalledWith('day', 1);
      expect(fetch).toHaveBeenCalled();
      expect(setCache).toHaveBeenCalledWith('day', 1, mockMovieData);
      expect(jsonMock).toHaveBeenCalledWith(mockMovieData);
    });

    it('should not cache data on API error', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (getCache as jest.Mock).mockReturnValue(null);
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ status_message: 'Server error' }),
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(setCache).not.toHaveBeenCalled();
    });

    it('should not cache data on invalid format', async () => {
      mockReq.params = { time_window: 'day' };
      mockReq.query = { page: '1' };

      (getCache as jest.Mock).mockReturnValue(null);
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ invalid: 'format' }),
      });

      await trendingMovieService(mockReq as Request, mockRes as Response);

      expect(setCache).not.toHaveBeenCalled();
    });
  });
});