// movieById.test.ts
import { Request, Response } from 'express';
import { movieByIdService } from '../controller/movieByID';

// Mock fetch globally
global.fetch = jest.fn();

describe('movieByIdService', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const mockMovieData = {
    id: 123,
    title: 'Test Movie',
    overview: 'A test movie description',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    runtime: 120,
    budget: 100000000,
    revenue: 500000000,
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
    ],
    production_companies: [
      { id: 1, name: 'Test Studios' },
    ],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie',
    popularity: 100.5,
    status: 'Released',
    tagline: 'An epic test',
    video: false,
  };

  beforeEach(() => {
    // Setup mock request and response
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      params: {},
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
    it('should return 400 if movie ID is missing', async () => {
      mockReq.params = {};

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Movie ID is required',
      });
    });

    it('should return 400 if movie ID is undefined', async () => {
      mockReq.params = { id: "" };

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Movie ID is required',
      });
    });

    it('should return 500 if API key is missing', async () => {
      delete process.env.api_key;
      mockReq.params = { id: '123' };

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'API key is required',
      });
    });
  });

  describe('Successful Fetch', () => {
    it('should fetch movie data successfully with valid ID', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/123',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-api-key',
          },
        }
      );
      expect(jsonMock).toHaveBeenCalledWith(mockMovieData);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should handle different movie IDs', async () => {
      mockReq.params = { id: '456' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockMovieData, id: 456 }),
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/456',
        expect.any(Object)
      );
      expect(jsonMock).toHaveBeenCalledWith({ ...mockMovieData, id: 456 });
    });

    it('should handle numeric IDs as strings', async () => {
      mockReq.params = { id: '999' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/999',
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    it('should return 500 if fetch fails (response not ok)', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch movie',
      });
    });

    it('should return 500 on 401 unauthorized', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch movie',
      });
    });

    it('should return 500 on 404 not found', async () => {
      mockReq.params = { id: '999999' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch movie',
      });
    });

    it('should return 502 if data is null', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => null,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(502);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Invalid data format from TMDB',
      });
    });

    it('should return 502 if data is undefined', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => undefined,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(502);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Invalid data format from TMDB',
      });
    });

    it('should handle network errors', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch movie',
      });
    });

    it('should handle timeout errors', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockRejectedValue(new Error('Request timeout'));

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch movie',
      });
    });

    it('should handle JSON parse errors', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch movie',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string ID', async () => {
      mockReq.params = { id: '' };

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Movie ID is required',
      });
    });

    it('should handle very large movie IDs', async () => {
      mockReq.params = { id: '999999999' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/999999999',
        expect.any(Object)
      );
    });

    it('should handle alphanumeric IDs (if API supports them)', async () => {
      mockReq.params = { id: 'tt1234567' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/tt1234567',
        expect.any(Object)
      );
    });

    it('should return data even if some fields are missing', async () => {
      mockReq.params = { id: '123' };

      const partialMovieData = {
        id: 123,
        title: 'Minimal Movie',
        overview: '',
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => partialMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith(partialMovieData);
    });

    it('should handle empty object response', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({});
    });
  });

  describe('API Integration', () => {
    it('should use correct TMDB API endpoint format', async () => {
      mockReq.params = { id: '550' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/550',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-api-key',
          },
        }
      );
    });

    it('should include Authorization header with Bearer token', async () => {
      mockReq.params = { id: '123' };
      process.env.api_key = 'custom-test-key';

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer custom-test-key',
          },
        })
      );
    });

    it('should use GET method', async () => {
      mockReq.params = { id: '123' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockMovieData,
      });

      await movieByIdService(mockReq as Request, mockRes as Response);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });
});