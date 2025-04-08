"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Star, Trash2, Film } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRatings } from "@/hooks/use-ratings"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb"
import { getMovieDetails } from "@/lib/tmdb"
import StarRating from "@/components/star-rating"

export default function RatingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { ratedMovies, isLoading, deleteRating, refresh } = useRatings()
  const [movieDetails, setMovieDetails] = useState<Record<number, any>>({})
  const [loadingMovies, setLoadingMovies] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in")
    }
  }, [user, router])

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (ratedMovies.length === 0) {
        setLoadingMovies(false)
        return
      }

      setLoadingMovies(true)
      try {
        const details = await Promise.all(
          ratedMovies.map(async (movie) => {
            try {
              return await getMovieDetails(movie.movie_id)
            } catch (error) {
              console.error(`Error fetching details for movie ${movie.movie_id}:`, error)
              return null
            }
          }),
        )

        const detailsMap: Record<number, any> = {}
        details.forEach((movie, index) => {
          if (movie) {
            detailsMap[ratedMovies[index].movie_id] = movie
          }
        })

        setMovieDetails(detailsMap)
      } catch (error) {
        console.error("Error fetching movie details:", error)
      } finally {
        setLoadingMovies(false)
      }
    }

    if (!isLoading && ratedMovies.length > 0) {
      fetchMovieDetails()
    } else if (!isLoading) {
      setLoadingMovies(false)
    }
  }, [ratedMovies, isLoading])

  if (!user) {
    return null
  }

  const isPageLoading = isLoading || loadingMovies

  return (
    <div className="max-w-6xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-8">
          <Star size={24} className="text-yellow-500" fill="currentColor" />
          <h1 className="text-3xl font-cinzel font-bold">Your Ratings</h1>
        </div>

        {isPageLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-red"></div>
          </div>
        ) : ratedMovies.length === 0 ? (
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <Film size={64} className="text-zinc-700" />
            </div>
            <h2 className="text-xl font-cinzel font-bold mb-2">You haven't rated any movies yet</h2>
            <p className="text-zinc-400 mb-6">Rate movies to keep track of what you've watched and enjoyed.</p>
            <Link href="/discover">
              <Button className="bg-theme-red hover:bg-theme-darkRed text-white">Discover Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ratedMovies.map((ratedMovie) => {
              const movie = movieDetails[ratedMovie.movie_id]
              if (!movie) return null

              return (
                <motion.div
                  key={ratedMovie.movie_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-2/3 p-4 flex flex-col">
                      <h3 className="text-lg font-cinzel font-bold mb-2 line-clamp-2">{movie.title}</h3>

                      <div className="flex items-center mt-2 mb-4">
                        <StarRating value={ratedMovie.rating} size="sm" readOnly />
                        <span className="ml-2 text-sm font-medium">{ratedMovie.rating}/10</span>
                      </div>

                      <div className="mt-auto flex justify-between">
                        <Link href={`/movie/${movie.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Details
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRating(movie.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
