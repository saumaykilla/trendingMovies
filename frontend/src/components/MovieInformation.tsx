"use client";

import React from "react";
import Image from "next/image";
import { MovieByID } from "../../../types/movie";
import { PlayIcon, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

type MovieInformationProps = {
  movie: MovieByID;
};

const MovieInformation: React.FC<MovieInformationProps> = ({ movie }) => {
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="relative h-full w-full ">
      {/* Backdrop */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          priority
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/30" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex items-start py-10 lg:py-0 lg:items-center h-full overflow-y-scroll">
        <div className="container mx-auto px-8">
          <div className="flex flex-col gap-4 mx-auto lg:flex-row items-start lg:items-center  justify-center lg:justify-start  lg:space-x-12">
            <div className="flex-shrink-0 w-full lg:w-80">
              <Image
                src={posterUrl}
                alt={movie.title}
                width={320}
                height={0} // give a real height
                className="rounded-xl shadow-2xl object-cover"
              />
            </div>
            <div className="flex max-w-80 lg:max-w-none flex-col gap-4">
              <h1 className="text-5xl lg:text-7xl font-black text-shadow leading-tight">
                {movie.title}
              </h1>
              <p className="text-2xl lg:text-4xl font-light text-gray-200  text-shadow">
                {movie.tagline}
              </p>
              <p className="text-sm  lg:text-xl text-gray-300  leading-relaxed max-w-2xl">
                {movie.overview}
              </p>
              <div className="flex gap-1 lg:gap-2 items-center">
                <span className ={` text-white px-2 py-1 rounded-md text-sm border border-gray-300`}>{movie.adult ? "A" : "PG"}</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const rating = movie.vote_average / 2; // 0-5
                    let fill = 0;
                    console.log(rating, i)
                    if (rating >= i) fill = 100; // full star
                    else if(rating >= i - 0.25) fill = 75; // 3/4 star
                    else if (rating >= i - 0.5) fill = 50; // half star
                    else if(rating >= i - 0.75) fill = 25; // 1/4 star

                    return (
                      <div key={i} className="relative w-5 h-5">
                        {/* Gray star background */}
                        <Star
                          className="text-gray-300 absolute inset-0"
                          size={20}
                        />
                        {/* Yellow overlay for full/half */}
                        {fill > 0 && (
                          <Star
                            className="text-yellow-400 absolute top-0 left-0 fill-yellow-400"
                            size={20}
                            style={{
                              clipPath:
                                fill === 100 ? "inset(0%)" : "inset(0 50% 0 0)",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-white font-bold text-xs lg:text-lg ">
                  {movie.vote_average.toFixed(2)}
                </span>
                {movie.vote_count && (
                  <span className="text-gray-300 text-xs lg:text-sm text-nowrap ">
                    ({movie.vote_count} reviews)
                  </span>
                )}
                <ol className="flex gap-2">
                <li className="text-gray-300 text-xs lg:text-sm text-nowrap font-medium ">{new Date(movie.release_date).getFullYear()}</li>
                <li className="text-gray-300 text-xs lg:text-sm text-nowrap font-medium ">{movie.runtime} min</li>
                </ol>
              </div>
              <div className="flex gap-2 flex-wrap">
                {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline">{genre.name}</Badge>
                ))}
              </div>
              <Link href={movie.homepage}>
              <Button variant="default"><PlayIcon size={20} className="text-white"/> Watch Now</Button>
              </Link>
            </div>
            {/* Add more movie info here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInformation;
