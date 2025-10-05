"use client";

import MovieCard from "@/components/MovieCard";
import { useFavorites } from "@/context/favouritesContext";



export default function Home() {

    const { favorites } = useFavorites()
  

  return (
    <div className="bg-background pt-14 flex flex-col">
      <main className="container  mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h1 className="text-2xl lg:text-4xl font-bold">My Favorite Movies</h1>
        </div>

        {/* Loading State */}
        {favorites.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No favorite movies yet</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie}/>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}