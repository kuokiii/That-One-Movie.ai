const TMDB_BASE_URL = ""
const IMAGE_BASE_URL = ""

export interface TMDBMovie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  overview: string
  vote_average: number
  genre_ids: number[]
  genres?: {
    id: number
    name: string
  }[]
  runtime?: number
  credits?: {
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
    crew: {
      id: number
      name: string
      job: string
    }[]
  }
}

export interface TMDBGenre {
  id: number
  name: string
}

export const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${process.env.TMDB_API_KEY}&${queryParams}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 * 60 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} for URL: ${endpoint}`)
      throw new Error(`TMDB API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to fetch from TMDB:", error)
    throw error
  }
}

export const getImageUrl = (path: string | null, size = "original") => {
  if (!path) return "/placeholder.svg?height=450&width=300"
  if (!path.startsWith("/")) return path // Already a full URL
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getPopularMovies = async () => {
  const data = await fetchFromTMDB("/movie/popular")
  return data.results as TMDBMovie[]
}

export const getMovieDetails = async (id: number) => {
  const data = await fetchFromTMDB(`/movie/${id}`, {
    append_to_response: "credits,similar",
  })
  return data as TMDBMovie
}

export const searchMovies = async (query: string) => {
  if (!query) return []
  const data = await fetchFromTMDB("/search/movie", { query })
  return data.results as TMDBMovie[]
}

export const getGenres = async () => {
  const data = await fetchFromTMDB("/genre/movie/list")
  return data.genres as TMDBGenre[]
}

export const getMoviesByGenre = async (genreId: number) => {
  const data = await fetchFromTMDB("/discover/movie", {
    with_genres: genreId.toString(),
  })
  return data.results as TMDBMovie[]
}

export const getMovieRecommendations = async (movieId: number) => {
  const data = await fetchFromTMDB(`/movie/${movieId}/recommendations`)
  return data.results as TMDBMovie[]
}

export const getTrendingMovies = async (timeWindow: "day" | "week" = "week") => {
  const data = await fetchFromTMDB(`/trending/movie/${timeWindow}`)
  return data.results as TMDBMovie[]
}
