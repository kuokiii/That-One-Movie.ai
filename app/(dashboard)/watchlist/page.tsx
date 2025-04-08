"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Clock, Trash2, Film } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useWatchlist } from "@/hooks/use-watchlist"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb"

export default function WatchlistPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { watchlist, isLoading, removeMovieFromWatchlist, refresh } = useWatchlist()

  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-8">
          <Clock size={24} className="text-theme-red" />
          <h1 className="text-3xl font-cinzel font-bold">Your Watchlist</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-red"></div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <Film size={64} className="text-zinc-700" />
            </div>
            <h2 className="text-xl font-cinzel font-bold mb-2">Your watchlist is empty</h2>
            <p className="text-zinc-400 mb-6">Add movies to your watchlist to keep track of what you want to watch.</p>
            <Link href="/discover">
              <Button className="bg-theme-red hover:bg-theme-darkRed text-white">Discover Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((movie) => (
              <motion.div
                key={movie.id}
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
                        alt={movie.movie_title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-2/3 p-4 flex flex-col">
                    <h3 className="text-lg font-cinzel font-bold mb-2 line-clamp-2">{movie.movie_title}</h3>

                    <div className="mt-auto flex justify-between">
                      <Link href={`/movie/${movie.movie_id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View Details
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMovieFromWatchlist(movie.movie_id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
