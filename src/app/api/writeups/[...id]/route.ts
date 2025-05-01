import { NextRequest, NextResponse } from "next/server"
import { getWriteupByPath } from "@/lib/writeups"

// In-memory cache to avoid repeated filesystem reads and markdown processing
const writeupCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    // Convert the params to a path
    const path = Array.isArray(params.id) ? params.id.join("/") : params.id

    // Check cache first
    const now = Date.now()
    const cachedData = writeupCache.get(path)
    const isCacheValid =
      cachedData && now - cachedData.timestamp < CACHE_DURATION

    if (isCacheValid) {
      // Return cached data with proper headers
      return NextResponse.json(cachedData.data, {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
          "Content-Type": "application/json",
        },
      })
    }

    // Fetch fresh data
    const writeup = await getWriteupByPath(path)

    if (!writeup) {
      return NextResponse.json({ error: "Writeup not found" }, { status: 404 })
    }

    // Update cache
    writeupCache.set(path, { data: writeup, timestamp: now })

    // Return the writeup with caching headers
    return NextResponse.json(writeup, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error(`Error fetching writeup ${params.id}:`, error)

    return NextResponse.json(
      { error: "Failed to fetch writeup" },
      { status: 500 }
    )
  }
}
