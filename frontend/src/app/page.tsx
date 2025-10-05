import TrendingMovieClient from "@/components/TrendingMovieClient";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trending/day?page=1`, {
    // Optional: control caching/revalidation
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return (
    <div className="bg-background flex flex-col">
      <TrendingMovieClient data={data.results} FetchedTotalPages={data.total_pages}/>
    </div>
  );
}