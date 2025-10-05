/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Movie } from "../../../../types/movie";
import TrendingMovieClient from "../TrendingMovieClient";

// Mock all UI components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid="skeleton" className={className} role="progressbar" />
  ),
}));

jest.mock("@/components/ui/tabs", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Tabs: ({ children, defaultValue, onValueChange }: any) => (
    <div data-testid="tabs" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, value }: any) => (
    <button data-testid="tabs-trigger" data-value={value} role="tab">
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/pagination", () => ({
  Pagination: ({ children }: any) => (
    <nav data-testid="pagination">{children}</nav>
  ),
  PaginationContent: ({ children }: any) => (
    <div data-testid="pagination-content">{children}</div>
  ),
  PaginationItem: ({ children }: any) => (
    <div data-testid="pagination-item">{children}</div>
  ),
  PaginationPrevious: ({ onClick, className }: any) => (
    <button
      data-testid="pagination-previous"
      onClick={onClick}
      className={className}
      aria-label="Previous"
    >
      Previous
    </button>
  ),
  PaginationNext: ({ onClick, className, size }: any) => (
    <button
      data-testid="pagination-next"
      onClick={onClick}
      className={className}
      data-size={size}
      aria-label="Next"
    >
      Next
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ onKeyDown, onBlur, defaultValue, placeholder, ...props }: any) => (
    <input
      data-testid="input"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      defaultValue={defaultValue}
      placeholder={placeholder}
      {...props}
    />
  ),
}));

// Mock MovieCard
jest.mock("../MovieCard", () => ({
  __esModule: true,
  default: ({ movie }: { movie: Movie }) => (
    <div data-testid="movie-card">{movie.title}</div>
  ),
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Mock environment variable
process.env.NEXT_PUBLIC_BACKEND_URL = "http://localhost:3001";

// Helper mock data
const mockMovies: Movie[] = [
  {
    adult: false,
    backdrop_path: "/inception_backdrop.jpg",
    id: 1,
    title: "Movie 1",
    original_language: "en",
    original_title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing.",
    poster_path: "/inception.jpg",
    media_type: "movie",
    genre_ids: [28, 878],
    popularity: 90.5,
    release_date: "2010-07-16",
    video: false,
    vote_average: 8.8,
    vote_count: 12000,
  }
];

describe("TrendingMovieClient Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders loading skeletons initially", async () => {
    // Mock fetch to never resolve to keep loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(<TrendingMovieClient data={mockMovies} FetchedTotalPages={10} />);
    });
    
    expect(screen.getAllByRole("progressbar").length).toBeGreaterThan(0);
  });

  it("renders movies after successful fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockMovies, total_pages: 10 }),
    });

    await act(async () => {
      render(<TrendingMovieClient data={[]} FetchedTotalPages={5} />);
    });

    await waitFor(() =>
      expect(screen.getAllByTestId("movie-card").length).toBe(mockMovies.length)
    );
  });

  it("renders error message when fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Server Error" }),
    });

    await act(async () => {
      render(<TrendingMovieClient data={[]} FetchedTotalPages={5} />);
    });

    await waitFor(() =>
      expect(
        screen.getByText(/Server Error|Failed to fetch movies/i)
      ).toBeInTheDocument()
    );
  });

  it("renders 'No movies found' message when backend returns empty results", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], total_pages: 0 }),
    });

    await act(async () => {
      render(<TrendingMovieClient data={[]} FetchedTotalPages={5} />);
    });

    await waitFor(() =>
      expect(
        screen.getByText(/No movies found for this selection/i)
      ).toBeInTheDocument()
    );
  });

  it("handles pagination next and previous correctly", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockMovies, total_pages: 3 }),
    });

    await act(async () => {
      render(<TrendingMovieClient data={mockMovies} FetchedTotalPages={3} />);
    });

    // Wait for first render
    await waitFor(() => screen.getByText("Trending Movies"));

    const nextButton = screen.getByRole("button", { name: /next/i });
    const prevButton = screen.getByRole("button", { name: /previous/i });

    await act(async () => {
      fireEvent.click(nextButton);
      fireEvent.click(prevButton);
    });

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/page=1|page=2/),
        expect.any(Object)
      )
    );
  });

  it("validates page input on blur and enter", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockMovies, total_pages: 10 }),
    });

    await act(async () => {
      render(<TrendingMovieClient data={mockMovies} FetchedTotalPages={10} />);
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const input = await screen.findByPlaceholderText("Page");

    // Invalid (negative) input
    await act(async () => {
      fireEvent.change(input, { target: { value: "-5" } });
      fireEvent.blur(input);
    });

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=1"),
        expect.any(Object)
      )
    );

    // Enter key with valid input
    await act(async () => {
      fireEvent.change(input, { target: { value: "3" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=3"),
        expect.any(Object)
      )
    );
  });

  it("prevents invalid characters in page input", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockMovies, total_pages: 10 }),
    });

    await act(async () => {
      render(<TrendingMovieClient data={mockMovies} FetchedTotalPages={10} />);
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const input = await screen.findByPlaceholderText("Page");

    const preventDefaultMinus = jest.fn();
    fireEvent.keyDown(input, { 
      key: "-", 
      preventDefault: preventDefaultMinus 
    });
    expect(input).toHaveValue(1);

  });

  it("aborts previous fetch on unmount", async () => {
    const abortMock = jest.fn();
    const abortControllerSpy = jest
      .spyOn(window, "AbortController")
      .mockImplementation(() => ({
        signal: {},
        abort: abortMock,
      }) as unknown as AbortController);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockMovies, total_pages: 5 }),
    });

    const { unmount } = render(
      <TrendingMovieClient data={mockMovies} FetchedTotalPages={5} />
    );

    unmount();
    expect(abortMock).toHaveBeenCalled();
    abortControllerSpy.mockRestore();
  });
});