"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  getWatchlistMovies,
  addToWatchlist,
  removeFromWatchlist,
  checkIsInWatchlist,
  type WatchlistMovie,
} from "@/lib/supabase"

export function useWatchlist() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadWatchlist()
    } else {
      setWatchlist([])
      setIsLoading(false)
    }
  }, [user])

  const loadWatchlist = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const data = await getWatchlistMovies(user.id)
      setWatchlist(data)
    } catch (error) {
      console.error("Error loading watchlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addMovieToWatchlist = async (movie: {
    movie_id: number
    movie_title: string
    poster_path: string | null
  }) => {
    if (!user) return null

    try {
      const newWatchlistItem = await addToWatchlist(user.id, movie)
      if (newWatchlistItem) {
        setWatchlist((prev) => [newWatchlistItem, ...prev])
      }
      return newWatchlistItem
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      return null
    }
  }

  const removeMovieFromWatchlist = async (movieId: number) => {
    if (!user) return false

    try {
      await removeFromWatchlist(user.id, movieId)
      setWatchlist((prev) => prev.filter((item) => item.movie_id !== movieId))
      return true
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      return false
    }
  }

  const isInWatchlist = async (movieId: number) => {
    if (!user) return false
    return checkIsInWatchlist(user.id, movieId)
  }

  return {
    watchlist,
    isLoading,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    isInWatchlist,
    refresh: loadWatchlist,
  }
}
