import { type NextRequest, NextResponse } from "next/server"

interface Movie {
  id: number
  title: string
  year: number
  genres: string[]
  similarTo?: number[]
}


const movies: Movie[] = [
  { id: 1, title: "The Green Knight", year: 2021, genres: ["Fantasy", "Adventure"], similarTo: [13, 14, 15, 16] },
  { id: 2, title: "Sonic The Hedgehog 2", year: 2022, genres: ["Action", "Comedy", "Family"], similarTo: [17, 18, 19] },
  { id: 3, title: "The Lost City", year: 2022, genres: ["Action", "Adventure", "Comedy"], similarTo: [20, 21, 22] },
  
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const movieId = searchParams.get("movieId")
  const userId = searchParams.get("userId")
  const limit = Number.parseInt(searchParams.get("limit") || "6")

  let recommendations: Movie[] = []

  if (movieId) {
    
    const movie = movies.find((m) => m.id === Number.parseInt(movieId))
    if (movie && movie.similarTo) {
      recommendations = movie.similarTo.map((id) => movies.find((m) => m.id === id)).filter(Boolean) as Movie[]
    }
  } else if (userId) {
    
    
    recommendations = movies
      .sort(() => 0.5 - Math.random()) 
      .slice(0, limit)
  } else {
    
    recommendations = movies.sort(() => 0.5 - Math.random()).slice(0, limit)
  }

  return NextResponse.json({ recommendations })
}
