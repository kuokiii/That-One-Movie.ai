"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getPopularMovies, getTrendingMovies } from "@/lib/tmdb"
import MovieCard from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, ChevronDown } from 'lucide-react'
import { motion } from "framer-motion"

export default function Home() {
  const [popularMovies, setPopularMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [visiblePopular, setVisiblePopular] = useState(10)
  const [visibleTrending, setVisibleTrending] = useState(5)

  useEffect(() => {
    async function fetchData() {
      try {
        const [popularData, trendingData] = await Promise.all([getPopularMovies(), getTrendingMovies()])
        setPopularMovies(popularData)
        setTrendingMovies(trendingData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleShowMorePopular = () => {
    const newCount = Math.min(visiblePopular + 5, popularMovies.length);
    setVisiblePopular(newCount);
  }

  const handleShowMoreTrending = () => {
    const newCount = Math.min(visibleTrending + 5, trendingMovies.length);
    setVisibleTrending(newCount);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-red"></div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto py-10"
      >
        <h1 className="text-5xl font-londrina font-bold mb-4 text-red-500">ThatOneMovie.ai</h1>
        <p className="text-xl text-zinc-300 font-playfair">AI-powered movie recommendations tailored to your taste</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/ai-recommendations">
            <Button className="bg-red-500 hover:bg-red-600 text-white py-6 px-8 text-lg flex items-center gap-2 neo-brutalist-red group transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
              <Brain size={20} className="group-hover:animate-pulse" />
              <span className="font-montserrat">Get AI Recommendations</span>
            </Button>
          </Link>
          <Link href="/discover">
            <Button
              variant="outline"
              className="py-6 px-8 text-lg border-white text-white hover:bg-white hover:text-black neo-brutalist font-montserrat group transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <TrendingUp size={20} className="mr-2 group-hover:text-red-500" />
              <span>Discover Movies</span>
            </Button>
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-cinzel font-bold mb-6 flex items-center">
          <TrendingUp size={24} className="mr-2 text-red-500" />
          TRENDING THIS WEEK
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingMovies.slice(0, visibleTrending).map((movie, index) => (
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

        {visibleTrending < trendingMovies.length && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleShowMoreTrending}
              variant="outline"
              className="group border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Show More Trending Movies
            </Button>
          </div>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-cinzel font-bold mb-6">POPULAR MOVIES</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularMovies.slice(0, visiblePopular).map((movie, index) => (
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

        {visiblePopular < popularMovies.length && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleShowMorePopular}
              variant="outline"
              className="group border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Show More Popular Movies
            </Button>
          </div>
        )}
      </motion.section>
    </div>
  )
}
