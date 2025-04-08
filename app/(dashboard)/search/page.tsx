import { searchMovies } from "@/lib/tmdb"
import MovieCard from "@/components/movie-card"
import { Search } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""
  const movies = query ? await searchMovies(query) : []

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Search size={24} className="text-red-500" />
        <h1 className="text-3xl font-bebas tracking-wider">SEARCH RESULTS FOR "{query}"</h1>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400">No movies found for "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
