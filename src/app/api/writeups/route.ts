import { NextRequest, NextResponse } from "next/server"
import { getAllWriteups } from "@/lib/writeups"

// In-memory cache to avoid repeated filesystem reads in development
let writeupCache: any = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 1000 * 60 * 10 // 10 minutes

export async function GET(request: NextRequest) {
  try {
    // Check cache freshness
    const now = Date.now()
    const isCacheValid = writeupCache && now - cacheTimestamp < CACHE_DURATION

    if (!isCacheValid) {
      // Cache miss or expired - fetch fresh data
      const writeups = await getAllWriteups()
      writeupCache = writeups
      cacheTimestamp = now
    }

    // Set proper cache headers for CDN and browser caching
    return NextResponse.json(writeupCache, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching writeups:", error)

    return NextResponse.json(
      { error: "Failed to fetch writeups" },
      { status: 500 }
    )
  }
}
