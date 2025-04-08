"use client"

import type React from "react"

import { useState } from "react"
import { Brain, X, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAIMovieRecommendations } from "@/app/actions"
import type { AIRecommendationRequest } from "@/lib/ai"
import { motion } from "framer-motion"

interface AIRecommendationFormProps {
  onResults: (results: any[]) => void
  setLoading: (loading: boolean) => void
}

export default function AIRecommendationForm({ onResults, setLoading }: AIRecommendationFormProps) {
  const [formData, setFormData] = useState<AIRecommendationRequest>({
    movieTitle: "",
    genres: [],
    actors: [],
    directors: [],
    description: "",
    mood: "",
    era: "",
  })

  const [inputGenre, setInputGenre] = useState("")
  const [inputActor, setInputActor] = useState("")
  const [inputDirector, setInputDirector] = useState("")
  const [activeSection, setActiveSection] = useState("basic") // basic, advanced

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const results = await getAIMovieRecommendations(formData)
      onResults(results)
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = (field: "genres" | "actors" | "directors", value: string) => {
    if (!value.trim()) return

    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }))

    // Clear the input field
    if (field === "genres") setInputGenre("")
    if (field === "actors") setInputActor("")
    if (field === "directors") setInputDirector("")
  }

  const removeItem = (field: "genres" | "actors" | "directors", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Find Your Perfect Movie</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={activeSection === "basic" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection("basic")}
              className={activeSection === "basic" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Basic
            </Button>
            <Button
              type="button"
              variant={activeSection === "advanced" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection("advanced")}
              className={activeSection === "advanced" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Advanced
            </Button>
          </div>
        </div>

        {activeSection === "basic" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="movieTitle" className="text-sm font-medium">
                Movie Title (Similar to)
              </Label>
              <Input
                id="movieTitle"
                placeholder="e.g., The Matrix, Inception"
                value={formData.movieTitle}
                onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 mt-1 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                What are you in the mood for?
              </Label>
              <Textarea
                id="description"
                placeholder="e.g., A mind-bending thriller with plot twists, A heartwarming story about friendship"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700 mt-1 min-h-[100px] focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mood" className="text-sm font-medium">
                  Mood
                </Label>
                <Input
                  id="mood"
                  placeholder="e.g., Uplifting, Dark, Funny"
                  value={formData.mood || ""}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 mt-1 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>

              <div>
                <Label htmlFor="era" className="text-sm font-medium">
                  Era
                </Label>
                <Input
                  id="era"
                  placeholder="e.g., 80s, 90s, Modern"
                  value={formData.era || ""}
                  onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 mt-1 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "advanced" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="genres" className="text-sm font-medium">
                Genres
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="genres"
                  placeholder="e.g., Action, Sci-Fi"
                  value={inputGenre}
                  onChange={(e) => setInputGenre(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addItem("genres", inputGenre)
                    }
                  }}
                  className="bg-zinc-800 border-zinc-700 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
                <Button
                  type="button"
                  onClick={() => addItem("genres", inputGenre)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {formData.genres && formData.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-zinc-800 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1 border border-zinc-700 animate-fadeIn"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => removeItem("genres", index)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="actors" className="text-sm font-medium">
                Actors
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="actors"
                  placeholder="e.g., Tom Hanks, Meryl Streep"
                  value={inputActor}
                  onChange={(e) => setInputActor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addItem("actors", inputActor)
                    }
                  }}
                  className="bg-zinc-800 border-zinc-700 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
                <Button
                  type="button"
                  onClick={() => addItem("actors", inputActor)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {formData.actors && formData.actors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.actors.map((actor, index) => (
                    <span
                      key={index}
                      className="bg-zinc-800 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1 border border-zinc-700 animate-fadeIn"
                    >
                      {actor}
                      <button
                        type="button"
                        onClick={() => removeItem("actors", index)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="directors" className="text-sm font-medium">
                Directors
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="directors"
                  placeholder="e.g., Christopher Nolan, Quentin Tarantino"
                  value={inputDirector}
                  onChange={(e) => setInputDirector(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addItem("directors", inputDirector)
                    }
                  }}
                  className="bg-zinc-800 border-zinc-700 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
                <Button
                  type="button"
                  onClick={() => addItem("directors", inputDirector)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {formData.directors && formData.directors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.directors.map((director, index) => (
                    <span
                      key={index}
                      className="bg-zinc-800 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1 border border-zinc-700 animate-fadeIn"
                    >
                      {director}
                      <button
                        type="button"
                        onClick={() => removeItem("directors", index)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 flex items-center justify-center gap-2 group transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Brain size={18} className="group-hover:animate-pulse" />
        <span>Get AI Recommendations</span>
        <Sparkles size={18} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    </form>
  )
}
