"use client"

import Image from "next/image"
import Link from "next/link"
import { type TMDBMovie, getImageUrl } from "@/lib/tmdb"
import type { AIRecommendation } from "@/lib/ai"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star } from "lucide-react"
import { motion } from "framer-motion"

interface EnrichedRecommendation extends AIRecommendation {
  tmdbMovie: TMDBMovie | null
}

export default function AIRecommendationResults({
  recommendations,
}: {
  recommendations: EnrichedRecommendation[]
}) {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bebas tracking-wider flex items-center gap-2"
      >
        <span className="text-red-500">AI</span> RECOMMENDATIONS
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden neo-brutalist hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col md:flex-row">
                {rec.tmdbMovie ? (
                  <div className="w-full md:w-1/3 relative aspect-[2/3] md:aspect-auto">
                    <Image
                      src={getImageUrl(rec.tmdbMovie.poster_path, "w500") || "/placeholder.svg"}
                      alt={rec.title}
                      fill
                      className="object-cover"
                    />
                    {rec.tmdbMovie.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1 flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold">{rec.tmdbMovie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full md:w-1/3 bg-zinc-800 flex items-center justify-center p-4">
                    <p className="text-zinc-400 text-center text-sm">No poster available</p>
                  </div>
                )}

                <CardContent className="flex-1 p-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-red-500 transition-colors">
                    {rec.title} {rec.year && `(${rec.year})`}
                  </h3>

                  <p className="mt-2 text-zinc-300 text-sm line-clamp-4">{rec.reason}</p>

                  {rec.tmdbMovie && (
                    <div className="mt-4">
                      <Link href={`/movie/${rec.tmdbMovie.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <span>View Details</span>
                          <ExternalLink size={12} />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
