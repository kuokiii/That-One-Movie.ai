"use client"

import { useState } from "react"
import { Brain, ChevronDown } from 'lucide-react'
import AIRecommendationForm from "@/components/ai-recommendation-form"
import AIRecommendationResults from "@/components/ai-recommendation-results"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function AIRecommendationsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [visibleResults, setVisibleResults] = useState(4)

  const handleShowMore = () => {
    const newCount = Math.min(visibleResults + 4, results.length);
    setVisibleResults(newCount);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bebas tracking-wider mb-4 flex items-center justify-center gap-2">
          <Brain size={32} className="text-red-500" />
          <span>AI MOVIE RECOMMENDATIONS</span>
        </h1>
        <p className="text-zinc-300">
          Tell us what you're in the mood for, and our AI will recommend movies tailored to your taste.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 neo-brutalist"
      >
        <AIRecommendationForm onResults={setResults} setLoading={setLoading} />
      </motion.div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-300">Thinking of the perfect movies for you...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AIRecommendationResults recommendations={results.slice(0, visibleResults)} />

          {visibleResults < results.length && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleShowMore}
                variant="outline"
                className="group border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Show More Recommendations
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
