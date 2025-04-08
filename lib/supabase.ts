import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserProfile = {
  id: string
  username: string
  avatar_url?: string
  created_at: string
}

export type FavoriteMovie = {
  id: string
  user_id: string
  movie_id: number
  movie_title: string
  poster_path: string | null
  created_at: string
}

export type WatchlistMovie = {
  id: string
  user_id: string
  movie_id: number
  movie_title: string
  poster_path: string | null
  created_at: string
}

export type UserRating = {
  id: string
  user_id: string
  movie_id: number
  rating: number
  created_at: string
  updated_at: string
}

// User Profile Functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId)

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  return data
}

// Favorites Functions
export async function getFavoriteMovies(userId: string): Promise<FavoriteMovie[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching favorite movies:", error)
    return []
  }

  return data || []
}

export async function addFavoriteMovie(
  userId: string,
  movie: {
    movie_id: number
    movie_title: string
    poster_path: string | null
  },
): Promise<FavoriteMovie | null> {
  const { data, error } = await supabase
    .from("favorites")
    .insert([
      {
        user_id: userId,
        ...movie,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding favorite movie:", error)
    return null
  }

  return data
}

export async function removeFavoriteMovie(userId: string, movieId: number) {
  const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("movie_id", movieId)

  if (error) {
    console.error("Error removing favorite movie:", error)
    throw error
  }

  return true
}

export async function checkIsFavorite(userId: string, movieId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return false
    }
    console.error("Error checking favorite status:", error)
    return false
  }

  return !!data
}

// Watchlist Functions
export async function getWatchlistMovies(userId: string): Promise<WatchlistMovie[]> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching watchlist movies:", error)
    return []
  }

  return data || []
}

export async function addToWatchlist(
  userId: string,
  movie: {
    movie_id: number
    movie_title: string
    poster_path: string | null
  },
): Promise<WatchlistMovie | null> {
  const { data, error } = await supabase
    .from("watchlist")
    .insert([
      {
        user_id: userId,
        ...movie,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding movie to watchlist:", error)
    return null
  }

  return data
}

export async function removeFromWatchlist(userId: string, movieId: number) {
  const { error } = await supabase.from("watchlist").delete().eq("user_id", userId).eq("movie_id", movieId)

  if (error) {
    console.error("Error removing movie from watchlist:", error)
    throw error
  }

  return true
}

export async function checkIsInWatchlist(userId: string, movieId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return false
    }
    console.error("Error checking watchlist status:", error)
    return false
  }

  return !!data
}

// Ratings Functions
export async function getUserRatedMovies(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("user_ratings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user rated movies:", error)
    return []
  }

  return data || []
}

export async function getUserRating(userId: string, movieId: number): Promise<number | null> {
  const { data, error } = await supabase
    .from("user_ratings")
    .select("rating")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null
    }
    console.error("Error fetching user rating:", error)
    return null
  }

  return data?.rating || null
}

export async function rateMovie(userId: string, movieId: number, rating: number): Promise<boolean> {
  // Check if rating already exists
  const { data: existingRating } = await supabase
    .from("user_ratings")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .single()

  let error

  if (existingRating) {
    // Update existing rating
    const result = await supabase
      .from("user_ratings")
      .update({
        rating,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRating.id)

    error = result.error
  } else {
    // Insert new rating
    const result = await supabase.from("user_ratings").insert([
      {
        user_id: userId,
        movie_id: movieId,
        rating,
      },
    ])

    error = result.error
  }

  if (error) {
    console.error("Error rating movie:", error)
    return false
  }

  return true
}

export async function deleteRating(userId: string, movieId: number): Promise<boolean> {
  const { error } = await supabase.from("user_ratings").delete().eq("user_id", userId).eq("movie_id", movieId)

  if (error) {
    console.error("Error deleting rating:", error)
    return false
  }

  return true
}
