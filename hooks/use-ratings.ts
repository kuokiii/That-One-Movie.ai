"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserRating, rateMovie, deleteRating, getUserRatedMovies } from "@/lib/supabase"

export function useRatings() {
  const { user } = useAuth()
  const [ratedMovies, setRatedMovies] = useState<{ movie_id: number; rating: number; created_at: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadRatedMovies()
    } else {
      setRatedMovies([])
      setIsLoading(false)
    }
  }, [user])

  const loadRatedMovies = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const data = await getUserRatedMovies(user.id)
      setRatedMovies(data)
    } catch (error) {
      console.error("Error loading rated movies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMovieRating = async (movieId: number) => {
    if (!user) return null
    return getUserRating(user.id, movieId)
  }

  const rateMovieById = async (movieId: number, rating: number) => {
    if (!user) return false

    try {
      const success = await rateMovie(user.id, movieId, rating)
      if (success) {
        // Update local state
        const existingIndex = ratedMovies.findIndex((m) => m.movie_id === movieId)
        if (existingIndex >= 0) {
          // Update existing rating
          setRatedMovies((prev) => {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              rating,
              created_at: new Date().toISOString(),
            }
            return updated
          })
        } else {
          // Add new rating
          setRatedMovies((prev) => [
            {
              movie_id: movieId,
              rating,
              created_at: new Date().toISOString(),
            },
            ...prev,
          ])
        }
      }
      return success
    } catch (error) {
      console.error("Error rating movie:", error)
      return false
    }
  }

  const deleteMovieRating = async (movieId: number) => {
    if (!user) return false

    try {
      const success = await deleteRating(user.id, movieId)
      if (success) {
        // Remove from local state
        setRatedMovies((prev) => prev.filter((m) => m.movie_id !== movieId))
      }
      return success
    } catch (error) {
      console.error("Error deleting rating:", error)
      return false
    }
  }

  return {
    ratedMovies,
    isLoading,
    getMovieRating,
    rateMovie: rateMovieById,
    deleteRating: deleteMovieRating,
    refresh: loadRatedMovies,
  }
}
