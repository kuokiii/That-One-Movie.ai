"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  className?: string
}

export default function StarRating({ value = 0, onChange, size = "md", readOnly = false, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (rating: number) => {
    if (readOnly) return
    onChange?.(rating)
  }

  const handleMouseEnter = (rating: number) => {
    if (readOnly) return
    setHoverRating(rating)
  }

  const handleMouseLeave = () => {
    if (readOnly) return
    setHoverRating(0)
  }

  return (
    <div className={cn("flex items-center", className)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
        <Star
          key={rating}
          className={cn(
            sizeClasses[size],
            "cursor-pointer transition-colors",
            (hoverRating || value) >= rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-400",
            !readOnly && "hover:text-yellow-300",
          )}
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  )
}
