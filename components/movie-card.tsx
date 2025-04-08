"use client"

import Image from "next/image"
import Link from "next/link"
import { type TMDBMovie, getImageUrl } from "@/lib/tmdb"
import { Star } from "lucide-react"

export interface Movie extends TMDBMovie {}

export default function MovieCard({ movie }: { movie: TMDBMovie }) {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : ""
  const posterUrl = getImageUrl(movie.poster_path, "w500")

  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative overflow-hidden rounded-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-red-500/20">
        <div className="aspect-[2/3] relative bg-zinc-800">
          <Image
            src={posterUrl || "/placeholder.svg?height=450&width=300"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            priority={false}
          />

          {/* Rating badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Movie info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-sm font-montserrat font-medium line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title} {releaseYear && `(${releaseYear})`}
          </h3>

          {/* Year badge */}
          {releaseYear && (
            <div className="mt-1 inline-block text-xs bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded">
              {releaseYear}
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-md transition-all duration-300 pointer-events-none"></div>
      </div>
    </Link>
  )
}
