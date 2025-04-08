"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Star, Clock, Calendar, Heart, BookmarkPlus, BookmarkCheck, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MovieCard from "@/components/movie-card"
import { getMovieDetails, getMovieRecommendations, getImageUrl } from "@/lib/tmdb"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useRatings } from "@/hooks/use-ratings"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import StarRating from "@/components/star-rating"

export default function MovieDetailPage() {
  const { id } = useParams()
  const movieId = Number.parseInt(id as string)
  const { user } = useAuth()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { addMovieToWatchlist, removeMovieFromWatchlist, isInWatchlist } = useWatchlist()
  const { getMovieRating, rateMovie, deleteRating } = useRatings()

  const [movie, setMovie] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [isWatchlist, setIsWatchlist] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [favLoading, setFavLoading] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [visibleRecommendations, setVisibleRecommendations] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, recommendationsData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieRecommendations(movieId),
        ])
        setMovie(movieData)
        setRecommendations(recommendationsData)

        if (user) {
          const [favStatus, watchlistStatus, rating] = await Promise.all([
            isFavorite(movieId),
            isInWatchlist(movieId),
            getMovieRating(movieId),
          ])
          setIsFav(favStatus)
          setIsWatchlist(watchlistStatus)
          setUserRating(rating)
        }
      } catch (error) {
        console.error("Error fetching movie details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId, user])

  const handleFavoriteToggle = async () => {
    if (!user || !movie) return

    setFavLoading(true)
    try {
      if (isFav) {
        await removeFromFavorites(movieId)
        setIsFav(false)
      } else {
        await addToFavorites({
          movie_id: movieId,
          movie_title: movie.title,
          poster_path: movie.poster_path,
        })
        setIsFav(true)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setFavLoading(false)
    }
  }

  const handleWatchlistToggle = async () => {
    if (!user || !movie) return

    setWatchlistLoading(true)
    try {
      if (isWatchlist) {
        await removeMovieFromWatchlist(movieId)
        setIsWatchlist(false)
      } else {
        await addMovieToWatchlist({
          movie_id: movieId,
          movie_title: movie.title,
          poster_path: movie.poster_path,
        })
        setIsWatchlist(true)
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error)
    } finally {
      setWatchlistLoading(false)
    }
  }

  const handleRatingChange = async (rating: number) => {
    if (!user) return

    setRatingLoading(true)
    try {
      await rateMovie(movieId, rating)
      setUserRating(rating)
    } catch (error) {
      console.error("Error rating movie:", error)
    } finally {
      setRatingLoading(false)
    }
  }

  const handleRemoveRating = async () => {
    if (!user) return

    setRatingLoading(true)
    try {
      await deleteRating(movieId)
      setUserRating(null)
    } catch (error) {
      console.error("Error removing rating:", error)
    } finally {
      setRatingLoading(false)
    }
  }

  const handleShowMoreRecommendations = () => {
    const newCount = Math.min(visibleRecommendations + 5, recommendations.length);
    setVisibleRecommendations(newCount);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-red"></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-cinzel font-bold">Movie not found</h2>
        <Link href="/home" className="text-theme-red hover:underline mt-4 inline-block">
          Return to home
        </Link>
      </div>
    )
  }

  const director = movie.credits?.crew.find((person: any) => person.job === "Director")
  const cast = movie.credits?.cast.slice(0, 5) || []
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : ""

  return (
    <div className="space-y-8">
      <Link href="/home" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        <span>Back to home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[40vh] md:h-[50vh] rounded-lg overflow-hidden"
      >
        <Image
          src={getImageUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl"
        >
          <Image
            src={getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
          />
          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-2 flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-3xl font-cinzel font-bold">
            {movie.title} {releaseYear && `(${releaseYear})`}
          </h1>

          <div className="flex flex-wrap gap-2 mt-3">
            {movie.genres?.map((genre: any) => (
              <Badge key={genre.id} className="bg-theme-red text-white hover:bg-theme-darkRed">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-zinc-400">
            {movie.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500" fill="currentColor" />
                <span>{movie.vote_average.toFixed(1)}/10</span>
              </div>
            )}
            {movie.runtime && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{movie.runtime} min</span>
              </div>
            )}
            {releaseYear && (
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{releaseYear}</span>
              </div>
            )}
          </div>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" fill="currentColor" />
                  <span className="font-medium">Your Rating</span>
                </div>
                {userRating && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveRating}
                    disabled={ratingLoading}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="mt-2">
                <StarRating value={userRating || 0} onChange={handleRatingChange} size="md" readOnly={ratingLoading} />
                {userRating && <span className="ml-2 text-sm font-medium text-yellow-500">{userRating}/10</span>}
              </div>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 text-zinc-300 font-lora"
          >
            {movie.overview}
          </motion.p>

          {director && (
            <div className="mt-6">
              <h3 className="font-semibold font-montserrat">Director</h3>
              <p className="text-zinc-400">{director.name}</p>
            </div>
          )}

          {cast.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold font-montserrat">Cast</h3>
              <p className="text-zinc-400">{cast.map((person: any) => person.name).join(", ")}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {user && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleFavoriteToggle}
                        disabled={favLoading}
                        className={isFav ? "border-theme-red text-theme-red" : ""}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-theme-red" : ""}`} />
                        {isFav ? "Remove from Favorites" : "Add to Favorites"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isFav ? "Remove from your favorites" : "Add to your favorites"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleWatchlistToggle}
                        disabled={watchlistLoading}
                        className={isWatchlist ? "border-blue-500 text-blue-500" : ""}
                      >
                        {isWatchlist ? (
                          <BookmarkCheck className="mr-2 h-4 w-4 fill-blue-500" />
                        ) : (
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                        )}
                        {isWatchlist ? "In Watchlist" : "Add to Watchlist"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isWatchlist ? "Remove from your watchlist" : "Add to your watchlist"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {recommendations.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-cinzel font-bold mb-4">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.slice(0, visibleRecommendations).map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>

          {visibleRecommendations < recommendations.length && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleShowMoreRecommendations}
                variant="outline"
                className="group border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Show More Similar Movies
              </Button>
            </div>
          )}
        </motion.section>
      )}
    </div>
  )
}
