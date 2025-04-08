"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Film } from "lucide-react"
import { getMoviesByGenre, getGenres } from "@/lib/tmdb"
import MovieCard from "@/components/movie-card"

export default function GenrePage() {
  const { id } = useParams()
  const genreId = Number.parseInt(id as string)

  const [movies, setMovies] = useState<any[]>([])
  const [genreName, setGenreName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, genresData] = await Promise.all([getMoviesByGenre(genreId), getGenres()])

        setMovies(moviesData)

        const genre = genresData.find((g) => g.id === genreId)
        if (genre) {
          setGenreName(genre.name)
        }
      } catch (error) {
        console.error("Error fetching genre data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [genreId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-red"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-8">
          <Film size={24} className="text-theme-red" />
          <h1 className="text-3xl font-cinzel font-bold">{genreName} Movies</h1>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">No movies found in this genre</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
