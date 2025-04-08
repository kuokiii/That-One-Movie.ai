"use client"

import { useState, useEffect } from "react"
import MovieCard from "@/components/movie-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGenres, getMoviesByGenre, getPopularMovies, getTrendingMovies } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import { motion } from "framer-motion"

export default function DiscoverPage() {
  const [genres, setGenres] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [genreMovies, setGenreMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const [visibleTrending, setVisibleTrending] = useState(10)
  const [visiblePopular, setVisiblePopular] = useState(10)
  const [visibleGenre, setVisibleGenre] = useState({})
  const [activeTab, setActiveTab] = useState("trending")

  useEffect(() => {
    async function fetchData() {
      try {
        const [genresData, popularData, trendingData] = await Promise.all([
          getGenres(),
          getPopularMovies(),
          getTrendingMovies(),
        ])

        setGenres(genresData)
        setPopularMovies(popularData)
        setTrendingMovies(trendingData)

        // Get movies for the first 3 genres
        const genreMoviesData = await Promise.all(genresData.slice(0, 3).map((genre) => getMoviesByGenre(genre.id)))
        setGenreMovies(genreMoviesData)

        // Initialize visible counts for each genre
        const initialVisibleGenre = {}
        genresData.slice(0, 3).forEach((genre, index) => {
          initialVisibleGenre[genre.id] = 10
        })
        setVisibleGenre(initialVisibleGenre)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleShowMoreTrending = () => {
    const newCount = Math.min(visibleTrending + 10, trendingMovies.length);
    setVisibleTrending(newCount);
  }

  const handleShowMorePopular = () => {
    const newCount = Math.min(visiblePopular + 10, popularMovies.length);
    setVisiblePopular(newCount);
  }

  const handleShowMoreGenre = (genreId) => {
    const currentGenreMovies = genreMovies[genres.findIndex(g => g.id === genreId)];
    const currentVisible = visibleGenre[genreId] || 10;
    const newCount = Math.min(currentVisible + 10, currentGenreMovies?.length || 0);
    
    setVisibleGenre((prev) => ({
      ...prev,
      [genreId]: newCount,
    }));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-red"></div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <h1 className="text-4xl font-bebas tracking-wider">DISCOVER MOVIES</h1>

      <Tabs defaultValue="trending" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900 border border-zinc-800 overflow-x-auto flex whitespace-nowrap">
          <TabsTrigger value="trending" className="data-[state=active]:bg-red-500">
            Trending
          </TabsTrigger>
          <TabsTrigger value="popular" className="data-[state=active]:bg-red-500">
            Popular
          </TabsTrigger>
          {genres.slice(0, 3).map((genre, index) => (
            <TabsTrigger key={genre.id} value={`genre-${genre.id}`} className="data-[state=active]:bg-red-500">
              {genre.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingMovies.slice(0, visibleTrending).map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
          {visibleTrending < trendingMovies.length && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleShowMoreTrending}
                variant="outline"
                className="group border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Show More Movies
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularMovies.slice(0, visiblePopular).map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
          {visiblePopular < popularMovies.length && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleShowMorePopular}
                variant="outline"
                className="group border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Show More Movies
              </Button>
            </div>
          )}
        </TabsContent>

        {genres.slice(0, 3).map((genre, index) => (
          <TabsContent key={genre.id} value={`genre-${genre.id}`} className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {genreMovies[index]?.slice(0, visibleGenre[genre.id] || 10).map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (idx % 10) * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
            {genreMovies[index]?.length > (visibleGenre[genre.id] || 10) && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => handleShowMoreGenre(genre.id)}
                  variant="outline"
                  className="group border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Show More Movies
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  )
}
