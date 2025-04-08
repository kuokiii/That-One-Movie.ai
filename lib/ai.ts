export interface AIRecommendationRequest {
  movieTitle?: string
  genres?: string[]
  actors?: string[]
  directors?: string[]
  description?: string
  mood?: string
  era?: string
}

export interface AIRecommendation {
  title: string
  year?: string
  reason: string
}

export const getAIRecommendations = async (request: AIRecommendationRequest): Promise<AIRecommendation[]> => {
  const { movieTitle, genres, actors, directors, description, mood, era } = request

  // Build the prompt based on the provided information
  let prompt = "Recommend 5 movies"

  if (movieTitle) {
    prompt += ` similar to "${movieTitle}"`
  }

  if (genres && genres.length > 0) {
    prompt += ` in the ${genres.join(", ")} genre(s)`
  }

  if (actors && actors.length > 0) {
    prompt += ` starring ${actors.join(", ")}`
  }

  if (directors && directors.length > 0) {
    prompt += ` directed by ${directors.join(", ")}`
  }

  if (description) {
    prompt += ` with the following elements: ${description}`
  }

  if (mood) {
    prompt += ` with a ${mood} mood`
  }

  if (era) {
    prompt += ` from the ${era} era`
  }

  prompt += `. For each movie, provide only the title, year, and a brief reason why it's recommended. Format the response as a simple JSON array with objects containing 'title', 'year', and 'reason' fields. Keep each reason under 100 characters. Ensure the JSON is valid and complete.`

  try {
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "",
        "X-Title": "ThatOneMovie.ai",
      },
      body: JSON.stringify({
        model: "",  
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse the JSON response with better error handling
    try {
      // Try to clean up the response if it has markdown code blocks
      let cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim()
      
      // If it starts with "ny" or any other unexpected characters, remove them
      if (cleanedContent.startsWith('ny')) {
        cleanedContent = cleanedContent.substring(2)
      }
      
      // Remove any other non-JSON prefix
      const jsonStart = cleanedContent.indexOf('[')
      if (jsonStart > 0) {
        cleanedContent = cleanedContent.substring(jsonStart)
      }
      
      // Try to parse the cleaned content
      const parsedContent = JSON.parse(cleanedContent)

      if (Array.isArray(parsedContent)) {
        return parsedContent.map(item => ({
          title: item.title || "Unknown Title",
          year: item.year?.toString() || "Unknown Year",
          reason: item.reason || "Recommended by AI"
        }))
      }
      
      // Fallback to empty array if we couldn't parse the response properly
      console.error("Unexpected AI response format:", parsedContent)
      return []
    } catch (e) {
      console.error("Failed to parse AI response:", e, "Raw content:", content)
      
      // Fallback: Create a simple array of placeholder recommendations
      return [
        {
          title: "The Shawshank Redemption",
          year: "1994",
          reason: "A timeless classic about hope and redemption."
        },
        {
          title: "Inception",
          year: "2010",
          reason: "A mind-bending thriller about dreams within dreams."
        },
        {
          title: "The Dark Knight",
          year: "2008",
          reason: "An iconic superhero film with an unforgettable villain."
        },
        {
          title: "Pulp Fiction",
          year: "1994",
          reason: "A stylish crime drama with non-linear storytelling."
        },
        {
          title: "The Matrix",
          year: "1999",
          reason: "A revolutionary sci-fi film about reality and perception."
        }
      ]
    }
  } catch (error) {
    console.error("Error getting AI recommendations:", error)
    // Return fallback recommendations
    return [
      {
        title: "The Godfather",
        year: "1972",
        reason: "The definitive mafia film and a cinematic masterpiece."
      },
      {
        title: "Forrest Gump",
        year: "1994",
        reason: "A heartwarming journey through American history."
      },
      {
        title: "The Lord of the Rings",
        year: "2001",
        reason: "An epic fantasy adventure with stunning visuals."
      },
      {
        title: "Star Wars",
        year: "1977",
        reason: "The space opera that changed cinema forever."
      },
      {
        title: "Jurassic Park",
        year: "1993",
        reason: "A thrilling adventure with groundbreaking special effects."
      }
    ]
  }
}
