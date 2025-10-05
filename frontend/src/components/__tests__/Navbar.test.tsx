import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";
import "@testing-library/jest-dom";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

describe("Navbar Component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("renders app name correctly", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navbar />);
      expect(screen.getByText("MovieHub")).toBeInTheDocument();
    });
  
    it("renders navigation items", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navbar />);
      expect(screen.getByText("Trending")).toBeInTheDocument();
      expect(screen.getByText("My Favourites")).toBeInTheDocument();
    });
  
    it("highlights the active link based on pathname", () => {
      (usePathname as jest.Mock).mockReturnValue("/favourites");
      render(<Navbar />);
      const activeLink = screen.getByText("My Favourites");
      expect(activeLink).toHaveClass("text-primary");
      expect(activeLink).toHaveClass("border-b-2");
    });
  
    it("non-active links do not have active classes", () => {
      (usePathname as jest.Mock).mockReturnValue("/favourites");
      render(<Navbar />);
      const inactiveLink = screen.getByText("Trending");
      expect(inactiveLink).not.toHaveClass("text-primary border-b-2");
    });
  });