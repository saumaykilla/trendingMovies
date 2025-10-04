"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie } from "../../../types/movie";
import MovieCard from "@/components/MovieCard";



export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tab, setTab] = useState<"day" | "week">("day");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const validatePage = (value: string) => {
    const pageNumber = Number(value);
    if (Number.isNaN(pageNumber) || pageNumber < 1) return 1;
    if (pageNumber > totalPages) return totalPages;
    return pageNumber;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "-" ||
      (isNaN(Number(e.key)) && e.key !== "Backspace" && e.key !== "Enter")
    ) {
      e.preventDefault();
    }

    if (e.key === "Enter") {
      const newPage = validatePage((e.target as HTMLInputElement).value);
      setPage(newPage);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newPage = validatePage(e.target.value);
    setPage(newPage);
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  useEffect(() => {
    const controller = new AbortController();
  
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null); // reset previous error
  
        const response = await fetch(
          `http://localhost:8000/trending/${tab}?page=${page}`,
          { signal: controller.signal }
        );
  
        if (!response.ok) {
          // Try to extract message from backend
          const errData = await response.json().catch(() => null);
          const errorMessage =
            errData?.message || `Error: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }
  
        const data = await response.json();
  
        // Handle empty results / total_pages === 0
        if (!data.results || data.total_pages === 0) {
          throw new Error("No movies found for this selection.");
        }
  
        setMovies(data.results);
        setTotalPages(data.total_pages);
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to fetch movies.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovies();
  
    // Cleanup to abort fetch if component unmounts or tab/page changes
    return () => controller.abort();
  }, [tab, page]);
  

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h1 className="text-2xl lg:text-4xl font-bold">Trending Movies</h1>
          {!loading && (
            <Tabs
              defaultValue={tab}
              onValueChange={(value) => {
                setTab(value as "day" | "week");
                setPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col md:flex-row overflow-hidden border border-border rounded-xl shadow-lg px-4">
                <Skeleton className="w-full md:w-1/3 h-56" />
                <CardContent className="flex flex-col p-4 md:w-2/3 gap-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border border-red-500 bg-red-100 p-6 text-center">
            <CardContent>
              <h2 className="text-xl font-bold text-red-700">Oops!</h2>
              <p className="text-red-700 mt-2">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie}/>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="flex justify-center pt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious className="border border-card bg-white text-black hover:text-white hover:cursor-pointer" onClick={handlePrev} />
                </PaginationItem>
                <PaginationItem>
                  <div className="flex justify-center items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    onBlur={handleBlur}
                    defaultValue={page}
                    onKeyDown={handleKeyDown}
                    className="w-16 text-center"
                    placeholder="Page"
                  />
                  <p className="text-[#666666] text-sm">{`of ${totalPages}`}</p>
                  </div>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext size={'lg'} onClick={handleNext} className="border border-card bg-[#666666] text-white hover:text-white hover:cursor-pointer" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}