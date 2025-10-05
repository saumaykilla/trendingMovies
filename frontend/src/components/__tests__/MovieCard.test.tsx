/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "../MovieCard"; 
import "@testing-library/jest-dom";
import { useFavorites } from "@/context/favouritesContext";
import { Movie } from "../../../../types/movie";

jest.mock("lucide-react", () => ({
    Star: () => <div data-testid="star-icon">Star</div>,
    InfoIcon: () => <div data-testid="info-icon">Info</div>,
  }));
  
  // Fix the image mock to destructure unused props
  jest.mock("next/image", () => {
    return function MockImage(props: any) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { priority, fill, ...rest } = props;
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...rest} alt={props.alt || "mocked image"} />;
    };
  });
  
  jest.mock("next/link", () => {
    // eslint-disable-next-line react/display-name
    return ({ children, href }: any) => <a href={href}>{children}</a>;
  });
  
  jest.mock("@/context/favouritesContext", () => ({
    useFavorites: jest.fn(),
  }));
  
  jest.mock("@/components/ui/card", () => ({
    Card: ({ children }: any) => <div data-testid="card">{children}</div>,
    CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  }));
  
  jest.mock("@/components/ui/badge", () => ({
    Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
  }));
  
  jest.mock("@/components/ui/button", () => ({
    Button: ({ children, onClick }: any) => (
      <button onClick={onClick} data-testid="button">
        {children}
      </button>
    ),
  }));
  

describe("MovieCard Component", () => {

    const mockToggleFavorite = jest.fn();
    const mockMovie: Movie = {
        adult: false,
        backdrop_path: "/inception_backdrop.jpg",
        id: 1,
        title: "Inception",
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
      };

      beforeEach(() => {
        jest.clearAllMocks();
      });


    it("renders movie details correctly", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    });

    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("2010-07-16")).toBeInTheDocument();
    expect(screen.getByText("A thief who steals corporate secrets through dream-sharing.")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Science Fiction")).toBeInTheDocument();
  });

  it("renders View Details link with correct href", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    });

    render(<MovieCard movie={mockMovie} />);

    const detailsLink = screen.getByText("View Details").closest("a");
    expect(detailsLink).toHaveAttribute("href", "/movie/1");
  });

  it("calls toggleFavorite when Add to Favorites button is clicked", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    });

    render(<MovieCard movie={mockMovie} />);
    const addButton = screen.getByText("Add to Favorites");
    fireEvent.click(addButton);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovie);
  });

  it("renders Remove Favorites state correctly when movie is already in favorites", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [mockMovie],
      toggleFavorite: mockToggleFavorite,
    });

    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText("Remove Favorites")).toBeInTheDocument();
    const removeButton = screen.getByText("Remove Favorites");
    fireEvent.click(removeButton);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovie);
  });
});