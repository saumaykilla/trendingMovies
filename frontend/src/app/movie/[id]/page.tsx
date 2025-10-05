import MovieInformation from "@/components/MovieInformation";
import React from "react";

const MovieDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error("Sorry, this movie is not available");
  return (
    <div className="bg-background h-full flex flex-col">
      <MovieInformation movie={data} />
    </div>
  );
};

export default MovieDetails;
