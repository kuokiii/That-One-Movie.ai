"use server"

import { searchMovies, getMovieDetails, getMovieRecommendations } from "@/lib/tmdb"
import { getAIRecommendations, type AIRecommendationRequest } from "@/lib/ai"

export async function searchMoviesByTitle(formData: FormData) {
  const title = formData.get("title") as string
  if (!title) return []

  return searchMovies(title)
}

export async function getRecommendationsForMovie(movieId: number) {
  try {
    const movie = await getMovieDetails(movieId)
    const tmdbRecommendations = await getMovieRecommendations(movieId)

    return {
      movie,
      recommendations: tmdbRecommendations,
    }
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return { movie: null, recommendations: [] }
  }
}

export async function getAIMovieRecommendations(request: AIRecommendationRequest) {
  try {
    const aiRecommendations = await getAIRecommendations(request)

    // For each AI recommendation, try to find a matching movie in TMDB
    const enrichedRecommendations = await Promise.all(
      aiRecommendations.map(async (rec) => {
        try {
          const searchResults = await searchMovies(rec.title)
          const matchingMovie = searchResults.find(
            (movie) =>
              movie.title.toLowerCase() === rec.title.toLowerCase() ||
              movie.title.toLowerCase().includes(rec.title.toLowerCase()),
          )

          return {
            ...rec,
            tmdbMovie: matchingMovie || null,
          }
        } catch (e) {
          return {
            ...rec,
            tmdbMovie: null,
          }
        }
      }),
    )

    return enrichedRecommendations
  } catch (error) {
    console.error("Error getting AI recommendations:", error)
    return []
  }
}

export async function getRecommendations(formData: FormData) {
  const movieTitle = formData.get("movieTitle") as string
  if (!movieTitle) return []

  // Mock implementation: return the first 6 search results for the movie title
  const searchResults = await searchMovies(movieTitle)
  return searchResults.slice(0, 6)
}
