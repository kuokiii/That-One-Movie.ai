"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Mail, Camera, AlertCircle, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserProfile } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const [username, setUsername] = useState(profile?.username || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!user || !profile) {
    router.push("/auth/sign-in")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updateUserProfile(user.id, { username })
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    // Use setTimeout to ensure this runs after the component is mounted
    setTimeout(() => {
      router.push("/")
    }, 0)
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-cinzel font-bold mb-8">Your Profile</h1>

        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-theme-red text-3xl">
                  {profile.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Button variant="outline" size="sm" className="text-xs">
                <Camera size={14} className="mr-1" />
                Change Photo
              </Button>
            </div>

            <div className="flex-1">
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle size={16} className="text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle size={16} className="text-green-500" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-400"
                    />
                  </div>
                  <p className="text-xs text-zinc-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      required
                      className="pl-10 bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="submit" disabled={isLoading} className="bg-theme-red hover:bg-theme-darkRed text-white">
                    <Save size={16} className="mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignOut}
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    Sign Out
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
