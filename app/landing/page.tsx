"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Brain, Film, Star, Search, Instagram, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Sample trending movies for the hero section
const HERO_MOVIES = [
  {
    title: "Oppenheimer",
    backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    year: 2023,
    rating: 8.5,
  },
  {
    title: "Avengers: Endgame",
    backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    year: 2019,
    rating: 8.4,
  },
  {
    title: "Avatar: The Way of Water",
    backdrop: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    year: 2022,
    rating: 7.7,
  },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [currentMovie, setCurrentMovie] = useState(0)
  const { scrollY } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)

  // Parallax effect for hero section
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1])
  const titleY = useTransform(scrollY, [0, 400], [0, -100])

  // Auto-rotate hero movies
  useEffect(() => {
    setMounted(true)

    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % HERO_MOVIES.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
              <Image
                src={HERO_MOVIES[currentMovie].backdrop || "/placeholder.svg"}
                alt={HERO_MOVIES[currentMovie].title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <header className="relative z-20 px-6 py-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-theme-red p-2 rounded-full">
                <Film className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-londrina font-bold">ThatOneMovie.ai</h1>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/home" className="text-white/80 hover:text-white transition-colors font-playfair">
                Browse
              </Link>
              <Link href="/discover" className="text-white/80 hover:text-white transition-colors font-playfair">
                Discover
              </Link>
              <Link
                href="/ai-recommendations"
                className="text-white/80 hover:text-white transition-colors font-playfair"
              >
                AI Recommendations
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <span className="font-montserrat text-sm">Connect with us:</span>
                <a
                  href="https://instagram.com/_kuoki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
              <Link href="/auth/sign-in">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center"
          style={{ y: titleY }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2 py-1 bg-theme-red rounded text-xs font-montserrat tracking-wider">FEATURED</div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-montserrat">{HERO_MOVIES[currentMovie].rating}/10</span>
                </div>
                <div className="text-xs text-white/70 font-montserrat">{HERO_MOVIES[currentMovie].year}</div>
              </div>

              <h1 className="text-5xl md:text-7xl font-londrina font-bold mb-6 text-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                ThatOneMovie.ai
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-2xl font-playfair mb-8">
                Discover your next favorite film with our AI-powered recommendation engine that understands your unique
                taste.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/ai-recommendations">
                  <Button
                    variant="outline"
                    className="py-6 px-8 text-lg border-white/30 bg-white/10 backdrop-blur-md hover:bg-red-500 hover:border-red-500 hover:text-white text-white rounded-full transition-all duration-300"
                  >
                    <Brain size={20} className="mr-2" />
                    <span className="font-montserrat">Get AI Recommendations</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Movie selector dots */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {HERO_MOVIES.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${currentMovie === index ? "bg-theme-red" : "bg-white/30"}`}
              onClick={() => setCurrentMovie(index)}
            />
          ))}
        </div>
      </motion.div>

      {/* Search Section with 3D Perspective */}
      <section className="relative py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">
              Find <span className="text-theme-red">That One Movie</span> You've Been Looking For
            </h2>
            <p className="text-lg text-white/70 mb-10 font-playfair">
              Our AI understands your taste and finds perfect recommendations tailored just for you.
            </p>

            <div className="relative max-w-2xl mx-auto perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-theme-red to-purple-600 rounded-xl blur-xl opacity-30 transform -rotate-1"></div>
              <div className="relative bg-zinc-800/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-2xl transform rotate-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-theme-red"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="What kind of movie are you looking for today?"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-theme-red font-montserrat"
                  />
                  <Link href="/ai-recommendations">
                    <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-theme-red hover:bg-theme-darkRed rounded-md px-4 py-2">
                      <Brain size={18} className="mr-2" />
                      Ask AI
                    </Button>
                  </Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Action", "Romance", "Sci-Fi", "Comedy", "Drama"].map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/70 font-montserrat"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-cinzel font-bold mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-theme-red mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Describe Your Mood",
                description:
                  "Tell our AI what kind of movie you're looking for - genres, actors, themes, or just a vibe.",
                icon: "🎭",
                color: "from-blue-500 to-purple-600",
              },
              {
                title: "AI Analyzes Your Taste",
                description: "Our advanced AI processes your preferences and searches through thousands of films.",
                icon: "🧠",
                color: "from-theme-red to-orange-500",
              },
              {
                title: "Get Perfect Recommendations",
                description: "Receive personalized movie suggestions with reasons why you'll love them.",
                icon: "🎬",
                color: "from-green-500 to-teal-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity`}
                ></div>
                <div className="relative bg-zinc-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 h-full flex flex-col items-center text-center">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-cinzel font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/70 font-playfair">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Floating Elements */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-theme-red/20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">Ready to find your next favorite movie?</h2>
            <p className="text-xl text-white/70 mb-10 font-playfair">
              Stop scrolling endlessly through streaming services. Let our AI find the perfect movie for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button className="bg-gradient-to-r from-theme-red to-theme-darkRed hover:from-theme-darkRed hover:to-theme-red text-white py-6 px-10 text-lg rounded-full shadow-lg shadow-theme-red/20">
                  <Film size={20} className="mr-2" />
                  <span className="font-montserrat">Get Started</span>
                </Button>
              </Link>
              <Link href="/ai-recommendations">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white py-6 px-10 text-lg rounded-full"
                >
                  <Brain size={20} className="mr-2" />
                  <span className="font-montserrat">Try AI Recommendations</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900/50 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="bg-theme-red p-2 rounded-full">
                <Film className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-londrina font-bold">ThatOneMovie.ai</h1>
            </div>

            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="/home" className="text-white/70 hover:text-white transition-colors font-montserrat">
                Browse
              </Link>
              <Link href="/discover" className="text-white/70 hover:text-white transition-colors font-montserrat">
                Discover
              </Link>
              <Link
                href="/ai-recommendations"
                className="text-white/70 hover:text-white transition-colors font-montserrat"
              >
                AI Recommendations
              </Link>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/kuokiii"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-theme-red transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <Github className="w-5 h-5 text-white/70" />
              </a>
              <a
                href="https://instagram.com/_kuoki"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-theme-red transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5 text-white/70" />
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 font-montserrat text-sm">
            <p>© 2024 ThatOneMovie.ai — Developed by Nirupam Thapa aka kuoki</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
