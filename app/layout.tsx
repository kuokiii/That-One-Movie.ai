import type React from "react"
import {
  Inter,
  Bebas_Neue,
  Cinzel,
  Montserrat,
  Playfair_Display,
  Lora,
  Poppins,
  Londrina_Solid,
} from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" })
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" })
const londrina = Londrina_Solid({ weight: ["400"], subsets: ["latin"], variable: "--font-londrina" })

export const metadata = {
  title: "ThatOneMovie.ai",
  description: "AI-powered movie recommendations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bebas.variable} ${cinzel.variable} ${montserrat.variable} ${playfair.variable} ${lora.variable} ${poppins.variable} ${londrina.variable} font-sans bg-black text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'