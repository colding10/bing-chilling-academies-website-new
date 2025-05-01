import { NextResponse } from "next/server"
import { getWriteupData } from "@/lib/writeups"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import rehypePrism from "rehype-prism-plus"
import rehypeSlug from "rehype-slug"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

export async function GET(request: Request) {
  try {
    // Extract the URL directly from the request
    const url = new URL(request.url)
    const pathSegments = url.pathname.split("/").filter(Boolean)

    // Remove 'api' and 'writeups' from the path segments
    const idSegments = pathSegments.slice(2) // Skip 'api' and 'writeups'

    // Join the segments with '/'
    const writeupId = idSegments.join("/")

    console.log(`Fetching writeup with ID: ${writeupId}`)

    const writeupData = await getWriteupData(writeupId)

    // Process the markdown content with syntax highlighting and slug generation
    const processedContent = await remark()
      .use(remarkGfm) // Support GitHub Flavored Markdown
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to rehype with HTML passthrough
      .use(rehypeSlug) // Add IDs to headings for the table of contents
      .use(rehypePrism, { ignoreMissing: true, showLineNumbers: true }) // Add syntax highlighting
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert back to HTML string
      .process(writeupData.content)

    const contentHtml = processedContent.toString()

    return NextResponse.json({
      ...writeupData,
      content: contentHtml,
    })
  } catch (error) {
    console.error(`Error handling request: ${error}`)
    return NextResponse.json({ error: "Writeup not found" }, { status: 404 })
  }
}
