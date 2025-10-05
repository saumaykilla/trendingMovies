/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieInformation from "../MovieInformation";
import { MovieByID } from "../../../../types/movie";

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

  jest.mock("@/components/ui/button", () => {
    return {
      Button: ({ children, onClick }: any) => (
        <button onClick={onClick} data-testid="button">
          {children}
        </button>
      ),
    };
  });
  
  jest.mock("@/components/ui/badge", () => ({
    Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
  }));

  // Mock lucide-react icons
  jest.mock("lucide-react", () => ({
    PlayIcon: () => <div data-testid="play-icon">Play</div>,
    Star: () => <div data-testid="star-icon">Star</div>,
  }));
  

describe("MovieInformation Component", () => {
    const mockMovie: MovieByID = {
        adult: false,
        backdrop_path: "/test-bg.jpg",
        belongs_to_collection: null,
        budget: 1000000,
        genres: [{ id: 1, name: "Action" }],
        homepage: "https://example.com",
        id: 1,
        imdb_id: "tt1234567",
        original_language: "en",
        original_title: "Inception",
        overview: "A mind-bending thriller.",
        popularity: 10,
        poster_path: "/poster.jpg",
        production_companies: [],
        production_countries: [],
        release_date: "2010-07-16",
        revenue: 100000000,
        runtime: 148,
        spoken_languages: [],
        status: "Released",
        tagline: "Your mind is the scene of the crime.",
        title: "Inception",
        video: false,
        vote_average: 8.8,
        vote_count: 20000,
      };

  it("renders movie details correctly", () => {
    render(<MovieInformation movie={mockMovie} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(
      screen.getByText("Your mind is the scene of the crime.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("A mind-bending thriller.")
    ).toBeInTheDocument();
    expect(screen.getByText("PG")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders correct vote average and release year", () => {
    render(<MovieInformation movie={mockMovie} />);

    expect(screen.getByText("8.80")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("148 min")).toBeInTheDocument();
  });

  it("renders Watch Now button with correct link", () => {
    render(<MovieInformation movie={mockMovie} />);

    const watchButton = screen.getByText("Watch Now");
    expect(watchButton).toBeInTheDocument();

    const link = watchButton.closest("a");
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
