import { NextResponse } from "next/server"
import { getAllWriteups } from "@/lib/writeups"
import type { WriteupMetadata } from "@/lib/writeups"
import { unstable_noStore as noStore } from "next/cache"

// In-memory cache to avoid filesystem operations
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes
let cachedWriteups: WriteupMetadata[] | null = null
let lastCacheTime = 0

export async function GET() {
  // Disable caching at the Next.js level
  noStore()
  
  try {
    const now = Date.now()
    // Check if we have valid cached data
    if (cachedWriteups && now - lastCacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedWriteups, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      })
    }

    // Get fresh data
    const writeups = await getAllWriteups()
    
    // Update cache
    cachedWriteups = writeups
    lastCacheTime = now

    return NextResponse.json(writeups, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error in writeups API:", error)
    return NextResponse.json(
      { error: "Failed to fetch writeups" },
      { status: 500 }
    )
  }
}
