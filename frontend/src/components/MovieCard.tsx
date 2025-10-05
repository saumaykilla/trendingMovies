import React from "react";
import { Card, CardContent } from "./ui/card";
import { Movie } from "../../../types/movie";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { Star, InfoIcon } from "lucide-react";
import { useFavorites } from "@/context/favouritesContext";

interface MovieCardProps {
  movie: Movie;
}

const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((favorite) => favorite.id === movie.id);
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden bg-card border border-border rounded-xl shadow-lg px-4">
      <div className="relative w-full md:w-1/3 h-56 md:h-auto">
        <Image
          src={
            movie?.poster_path
              ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
              : "/fallback.png"
          }
          alt={movie?.title}
          fill
          className="object-center"
        />
      </div>
      <CardContent className="flex flex-col  md:w-2/3 justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          <p className="text-muted-foreground text-sm mb-1">
            {movie.release_date}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {movie.genre_ids?.map((genre, index) => (
              <Badge key={index} className="text-secondary-foreground">
                {genreMap[genre] || genre}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">{movie.overview}</p>
        </div>

        <div className="flex justify-end items-center gap-4">
          <Button variant="secondary">
            <InfoIcon className="size-4" />
            <Link href={`/movie/${movie.id}`}>View Details</Link>
          </Button>
          <Button
            variant={isFavorite ? "default" : "secondary"}
            onClick={() => toggleFavorite(movie)}
          >
            <Star
              className={`${
                isFavorite ? "fill-yellow-500 text-yellow-500" : "text-gray-500"
              } size-6`}
            />
            <p>{isFavorite ? "Remove Favorites" : "Add to Favorites"}</p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
