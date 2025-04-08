"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Search, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import MovieCard, { type Movie } from "@/components/movie-card"
import { getRecommendations } from "@/app/actions"

export default function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("movieTitle", searchQuery)

    startTransition(async () => {
      const results = await getRecommendations(formData)
      setRecommendations(results)
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight neo-brutalist-red bg-black p-4">CINEMATIC BRAIN 🎬🧠</h1>
        <p className="mt-4 text-lg text-zinc-400">
          Our AI-powered recommendation engine analyzes your taste to suggest movies you'll love.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 neo-brutalist">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input
                type="text"
                placeholder="Enter a movie you love..."
                className="pl-10 bg-zinc-800 border-zinc-700 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white" disabled={isPending}>
              {isPending ? "Thinking..." : "Get Recommendations"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <section>
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4">RECOMMENDED FOR YOU</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((movie) => (
              <div key={movie.id} className="space-y-2">
                <MovieCard movie={movie} />
                <div className="flex justify-between px-1">
                  <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-400 p-1 h-auto">
                    <ThumbsUp size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 p-1 h-auto">
                    <ThumbsDown size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
