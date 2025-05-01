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

// In-memory cache to avoid repeated filesystem reads and markdown processing
const writeupCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

// Process markdown to HTML with syntax highlighting
async function processMarkdown(content: string): Promise<string> {
  try {
    // Fix any potential Unicode issues or invisible characters
    const sanitizedContent = content
      .replace(/\u200B/g, "") // Zero-width space
      .replace(/\uFEFF/g, "") // BOM
      .replace(/�/g, "") // Replacement character

    // Handle problematic special characters in code blocks
    const fixedCodeBlocks = sanitizedContent.replace(
      /```(.*?)\n([\s\S]*?)```/g,
      (match, language, code) => {
        // Ensure proper code block formatting
        return `\`\`\`${language || ""}\n${code.trim()}\n\`\`\``
      }
    )

    const result = await remark()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      // Fix type error by explicitly typing the rehypePrism options
      .use(rehypePrism as any, { showLineNumbers: true })
      .use(rehypeSlug)
      .use(rehypeStringify)
      .process(fixedCodeBlocks)

    return result.toString()
  } catch (error) {
    console.error("Error processing markdown:", error)

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
        // Convert headers, bold, and code blocks manually
        const manuallyProcessed = content
          .replace(/^# (.*$)/gm, "<h1>$1</h1>")
          .replace(/^## (.*$)/gm, "<h2>$1</h2>")
          .replace(/^### (.*$)/gm, "<h3>$1</h3>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/```(.*?)\n([\s\S]*?)```/gm, "<pre><code>$2</code></pre>")
          .replace(/`([^`]+)`/g, "<code>$1</code>")
          .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
          .replace(/\n/g, "<br />")

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
    writeupCache.set(path, { data: processedWriteup, timestamp: now })

    // Return the writeup with caching headers
    return NextResponse.json(processedWriteup, {
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
