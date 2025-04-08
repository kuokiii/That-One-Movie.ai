"use client"

import Link from "next/link"
import { Film, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-zinc-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-theme-red p-2 rounded-full">
              <Film className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-cinzel font-bold">ThatOneMovie.ai</h1>
          </Link>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 shadow-xl text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>

          <h2 className="text-2xl font-cinzel font-bold mb-4">Check your email</h2>

          <p className="text-zinc-300 mb-6">
            We've sent you a verification link to your email address. Please check your inbox and click the link to
            verify your account.
          </p>

          <div className="space-y-4">
            <Link href="/auth/sign-in">
              <Button className="w-full bg-theme-red hover:bg-theme-darkRed text-white">Go to Sign In</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
