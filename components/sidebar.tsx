"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Library, Heart, Film, Star, Search, List, Brain, User, Clock, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"

const NavItem = ({
  icon: Icon,
  label,
  href,
  badge,
  active,
}: {
  icon: any
  label: string
  href: string
  badge?: number
  active?: boolean
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      active ? "bg-theme-red text-white" : "hover:bg-zinc-800",
    )}
  >
    <Icon size={18} />
    <span className="font-montserrat">{label}</span>
    {badge && (
      <span className="ml-auto bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
        {badge}
      </span>
    )}
  </Link>
)

export default function Sidebar() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto"
    >
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-theme-red p-1 rounded">
            <Film className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-theme-red text-xl font-londrina">ThatOneMovie.ai</h1>
        </Link>

        <div className="relative mt-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-theme-red font-montserrat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
          <span>Connect with us:</span>
          <a
            href="https://instagram.com/_kuoki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <Instagram size={14} />
            <span>@_kuoki</span>
          </a>
        </div>
      </div>

      <nav className="mt-2 px-2 space-y-1">
        <NavItem icon={Home} label="Home" href="/home" active={pathname === "/home"} />
        <NavItem
          icon={Brain}
          label="AI Recommendations"
          href="/ai-recommendations"
          active={pathname === "/ai-recommendations"}
        />
        <NavItem icon={Library} label="Discover" href="/discover" active={pathname === "/discover"} />

        {user && (
          <>
            <NavItem icon={Heart} label="Favorites" href="/favorites" active={pathname === "/favorites"} />
            <NavItem icon={Clock} label="Watchlist" href="/watchlist" active={pathname === "/watchlist"} />
            <NavItem icon={Star} label="Ratings" href="/ratings" active={pathname === "/ratings"} />
            <NavItem icon={User} label="Profile" href="/profile" active={pathname === "/profile"} />
          </>
        )}

        {!user && <NavItem icon={User} label="Sign In" href="/auth/sign-in" active={pathname === "/auth/sign-in"} />}
      </nav>

      <div className="mt-6 px-4">
        <h2 className="text-xs font-montserrat font-semibold text-zinc-400 tracking-wider uppercase">GENRES</h2>
      </div>

      <nav className="mt-2 px-2 space-y-1">
        <NavItem icon={Film} label="Action" href="/genre/28" active={pathname === "/genre/28"} />
        <NavItem icon={Film} label="Comedy" href="/genre/35" active={pathname === "/genre/35"} />
        <NavItem icon={Film} label="Drama" href="/genre/18" active={pathname === "/genre/18"} />
        <NavItem icon={Film} label="Sci-Fi" href="/genre/878" active={pathname === "/genre/878"} />
        <NavItem icon={Film} label="Horror" href="/genre/27" active={pathname === "/genre/27"} />
      </nav>

      {user && (
        <>
          <div className="mt-6 px-4">
            <h2 className="text-xs font-montserrat font-semibold text-zinc-400 tracking-wider uppercase">MY LISTS</h2>
          </div>

          <nav className="mt-2 px-2 space-y-1">
            <NavItem icon={List} label="Create New List" href="/lists/create" active={pathname === "/lists/create"} />
          </nav>
        </>
      )}
    </motion.div>
  )
}
