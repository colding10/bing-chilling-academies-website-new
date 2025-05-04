import { NextRequest, NextResponse } from "next/server"
import { getWriteupData } from "@/lib/writeups"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypeRaw from "rehype-raw"
import rehypePrism from "rehype-prism-plus"
import rehypeSlug from "rehype-slug"
import { unstable_noStore as noStore } from "next/cache"

// Properly typed cache for better type safety
interface CacheEntry {
  data: Record<string, unknown>
  timestamp: number
}

// In-memory cache to avoid repeated filesystem reads and markdown processing
const writeupCache = new Map<string, CacheEntry>()
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

// Process markdown to HTML with syntax highlighting
async function processMarkdown(content: string): Promise<string> {
  // Return empty string for empty content to avoid processing errors
  if (!content || content.trim() === "") {
    console.warn("Received empty content for markdown processing")
    return ""
  }

  try {
    // Fix any potential Unicode issues or invisible characters
    const sanitizedContent = content
      .replace(/\u200B/g, "") // Zero-width space
      .replace(/\uFEFF/g, "") // BOM
      .replace(/�/g, "") // Replacement character

    // Handle problematic special characters in code blocks with better regex
    const fixedCodeBlocks = sanitizedContent.replace(
      /```(.*?)(?:\r?\n)([\s\S]*?)```/g,
      (match, language, code) => {
        // Normalize line endings and trim trailing whitespace
        const normalizedCode = code.trim().replace(/\r\n/g, "\n")
        return `\`\`\`${language || ""}\n${normalizedCode}\n\`\`\``
      }
    )

    // Primary processing pipeline with unified/remark ecosystem
    const result = await remark()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypePrism)
      .use(rehypeSlug)
      .use(rehypeStringify)
      .process(fixedCodeBlocks)

    return result.toString()
  } catch (error) {
    console.error("Error in primary markdown processing:", error)

    // Fallback to simpler processing chain if the full one fails
    try {
      const simpleResult = await remark()
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify)
        .process(content)

      return simpleResult.toString()
    } catch (fallbackError) {
      console.error("Fallback markdown processing failed:", fallbackError)

      // Last resort - convert markdown manually for basic formatting
      try {
        // Convert headers, bold, and code blocks manually with more robust regex
        const manuallyProcessed = content
          // Headers
          .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
          .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
          .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
          .replace(/^#### (.*?)$/gm, "<h4>$1</h4>")
          // Bold, italic
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          // Code blocks and inline code
          .replace(/```(?:.*?)\n([\s\S]*?)```/gm, "<pre><code>$1</code></pre>")
          .replace(/`([^`]+)`/g, "<code>$1</code>")
          // Links and images
          .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
          // Line breaks - only convert actual line breaks, not within code blocks
          .replace(/\n(?!<\/code>)/g, "<br />")

        return manuallyProcessed
      } catch (manualError) {
        console.error("Manual markdown processing failed:", manualError)
        // Return the original content wrapped in a pre tag as absolute last resort
        return `<pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`
      }
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string[] } }
) {
  // Prevent caching at the Next.js level for dynamic content
  noStore()

  try {
    // Convert the params to a path with proper validation
    if (!params.id || !Array.isArray(params.id) || params.id.length === 0) {
      return NextResponse.json({ error: "Invalid writeup ID" }, { status: 400 })
    }

    const path = params.id.join("/")

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
    const writeup = await getWriteupData(path)

    if (!writeup) {
      return NextResponse.json({ error: "Writeup not found" }, { status: 404 })
    }

    // Ensure content is a string before processing
    const contentToProcess =
      typeof writeup.content === "string"
        ? writeup.content
        : String(writeup.content || "")

    // Process markdown content to HTML
    const processedContent = await processMarkdown(contentToProcess)

    // Create a new writeup object with processed content
    const processedWriteup = {
      ...writeup,
      content: processedContent,
    }

    // Update cache
    writeupCache.set(path, {
      data: processedWriteup,
      timestamp: now,
    })

    // Return the writeup with caching headers
    return NextResponse.json(processedWriteup, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error processing writeup:", error)
    return NextResponse.json(
      {
        error: "Failed to process writeup",
        details: (error as Error).message,
      },
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
