import { NextResponse } from "next/server"
import { getAllWriteups } from "@/lib/writeups"
import type { WriteupMetadata } from "@/lib/writeups"
import { unstable_noStore as noStore } from "next/cache"

// In-memory cache with proper typing
interface CacheData {
  writeups: WriteupMetadata[]
  timestamp: number
}

const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes
let cachedWriteups: CacheData | null = null

export async function GET() {
  // Disable Next.js caching for dynamic data
  noStore()

  try {
    const now = Date.now()

    // Check for valid cached data to avoid unnecessary processing
    if (cachedWriteups && now - cachedWriteups.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedWriteups.writeups, {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      })
    }

    // Get fresh data
    const writeups = await getAllWriteups()

    // Update cache with proper typing
    cachedWriteups = {
      writeups,
      timestamp: now,
    }

    return NextResponse.json(writeups, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in writeups API:", error)

    // Return a proper error response with status code
    return NextResponse.json(
      { error: "Failed to fetch writeups", details: (error as Error).message },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    )
  }
}
