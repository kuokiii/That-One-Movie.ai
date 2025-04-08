"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  getFavoriteMovies,
  addFavoriteMovie,
  removeFavoriteMovie,
  checkIsFavorite,
  type FavoriteMovie,
} from "@/lib/supabase"

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      setFavorites([])
      setIsLoading(false)
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const data = await getFavoriteMovies(user.id)
      setFavorites(data)
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToFavorites = async (movie: {
    movie_id: number
    movie_title: string
    poster_path: string | null
  }) => {
    if (!user) return null

    try {
      const newFavorite = await addFavoriteMovie(user.id, movie)
      if (newFavorite) {
        setFavorites((prev) => [newFavorite, ...prev])
      }
      return newFavorite
    } catch (error) {
      console.error("Error adding to favorites:", error)
      return null
    }
  }

  const removeFromFavorites = async (movieId: number) => {
    if (!user) return false

    try {
      await removeFavoriteMovie(user.id, movieId)
      setFavorites((prev) => prev.filter((fav) => fav.movie_id !== movieId))
      return true
    } catch (error) {
      console.error("Error removing from favorites:", error)
      return false
    }
  }

  const isFavorite = async (movieId: number) => {
    if (!user) return false
    return checkIsFavorite(user.id, movieId)
  }

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refresh: loadFavorites,
  }
}
