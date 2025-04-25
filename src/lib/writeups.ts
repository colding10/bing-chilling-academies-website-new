import fs from "fs"
import path from "path"
import matter from "gray-matter"

const writeupsDirectory = path.join(process.cwd(), "_writeups")

export interface WriteupMetadata {
  id: string
  title: string
  ctfName: string
  date: string
  tags: string[]
  description: string
  author: string
}

export interface Writeup extends WriteupMetadata {
  content: string
}

// Improved helper function to find all markdown files recursively with better error handling
function findMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  try {
    // Check if directory exists to prevent errors
    if (!fs.existsSync(dir)) {
      console.warn(`Directory not found: ${dir}`)
      return fileList
    }

    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      try {
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          // Recurse into subdirectories
          findMarkdownFiles(filePath, fileList)
        } else if (file === "main.md") {
          // Only consider main.md files as valid writeups
          fileList.push(filePath)
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error)
      }
    })

    return fileList
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
    return fileList
  }
}

// Cache for getAllWriteups to avoid redundant file system operations
let writeupCache: WriteupMetadata[] | null = null
let lastCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function getAllWriteups(): WriteupMetadata[] {
  // Return cached results if available and not expired
  const now = Date.now()
  if (writeupCache && now - lastCacheTime < CACHE_TTL) {
    return writeupCache
  }

  try {
    const markdownFiles = findMarkdownFiles(writeupsDirectory)

    const writeups = markdownFiles
      .map((filePath) => {
        try {
          const relativePath = path.relative(writeupsDirectory, filePath)
          const dirPath = path.dirname(relativePath)
          const id = dirPath.replace(/\\/g, "/") // Normalize path separators

          // Read file content once and reuse
          const fileContents = fs.readFileSync(filePath, "utf8")
          const { data } = matter(fileContents)

          // Validate and provide defaults for required fields
          return {
            id,
            title: data.title || "Untitled",
            ctfName: data.ctfName || "Unknown CTF",
            date: data.date || new Date().toISOString(),
            tags: Array.isArray(data.tags) ? data.tags : [],
            description: data.description || "",
            author: data.author || "Anonymous",
          }
        } catch (error) {
          console.error(`Error processing writeup file ${filePath}:`, error)
          return null
        }
      })
      .filter(Boolean) as WriteupMetadata[]

    // Sort by date descending (newest first)
    const sortedWriteups = writeups.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Update cache
    writeupCache = sortedWriteups
    lastCacheTime = now

    return sortedWriteups
  } catch (error) {
    console.error("Error in getAllWriteups:", error)
    return []
  }
}

// Cache for individual writeup content
const writeupContentCache = new Map<string, Writeup>()

export async function getWriteupData(id: string): Promise<Writeup> {
  try {
    // Check cache first
    if (writeupContentCache.has(id)) {
      return writeupContentCache.get(id)!
    }

    // Handle path separators in the id to find files in subdirectories
    const normalizedId = id.replace(/\//g, path.sep)
    const fullPath = path.join(writeupsDirectory, `${normalizedId}/main.md`)

    // Check if file exists before reading
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`)
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)

    const result = {
      id,
      content: matterResult.content,
      ...(matterResult.data as Omit<WriteupMetadata, "id">),
    }

    // Cache the result
    writeupContentCache.set(id, result)

    return result
  } catch (error) {
    console.error(`Error in getWriteupData for ${id}:`, error)
    throw error
  }
}
