// writeups.ts
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const writeupsDirectory = path.join(process.cwd(), "_writeups")

export interface WriteupMetadata {
  id: string
  title: string
  date: string
  tags: string[]
  description: string
  author: string
  coverImage?: string
}

export interface Writeup extends WriteupMetadata {
  content: string
  images: string[]
}

/**
 * Recursively searches directories to find writeup folders
 * A valid writeup folder contains a markdown file (usually index.md)
 */
function findWriteupFolders(dir: string): string[] {
  const result: string[] = []

  // Get all items in the directory
  const items = fs.readdirSync(dir)

  // Check if this directory contains a markdown file
  const hasMd = items.some((item) => item.endsWith(".md"))
  if (hasMd) {
    result.push(dir)
  }

  // Recursively search subdirectories
  for (const item of items) {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      result.push(...findWriteupFolders(fullPath))
    }
  }

  return result
}

/**
 * Gets the ID for a writeup folder based on its path
 */
function getWriteupId(folderPath: string): string {
  // Remove base directory and convert to URL-friendly format
  return folderPath
    .replace(writeupsDirectory, "")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "-")
}

/**
 * Find the primary markdown file in a writeup folder
 */
function getMarkdownFile(folderPath: string): string {
  const files = fs.readdirSync(folderPath)

  // First try to find index.md, README.md, or writeup.md
  const preferredNames = ["index.md", "README.md", "writeup.md"]
  for (const name of preferredNames) {
    if (files.includes(name)) {
      return path.join(folderPath, name)
    }
  }

  // Otherwise, return the first markdown file
  const mdFile = files.find((file) => file.endsWith(".md"))
  if (mdFile) {
    return path.join(folderPath, mdFile)
  }

  throw new Error(`No markdown file found in ${folderPath}`)
}

/**
 * Get paths of all images in the writeup folder
 */
function getWriteupImages(folderPath: string): string[] {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]
  const files = fs.readdirSync(folderPath)

  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext)
    })
    .map((file) => {
      // Convert to relative path that can be used in HTML
      const relativePath = path.join(
        "/writeup-assets",
        getWriteupId(folderPath),
        file
      )
      return relativePath.replace(/\\/g, "/")
    })
}

/**
 * Get metadata for all writeups
 */
export function getAllWriteups(): WriteupMetadata[] {
  const writeupFolders = findWriteupFolders(writeupsDirectory)

  const allWriteupsData = writeupFolders.map((folderPath) => {
    const id = getWriteupId(folderPath)
    const mdFilePath = getMarkdownFile(folderPath)
    const fileContents = fs.readFileSync(mdFilePath, "utf8")
    const matterResult = matter(fileContents)
    const images = getWriteupImages(folderPath)

    // Try to find a cover image (either specified in frontmatter or use the first image)
    let coverImage = matterResult.data.coverImage
    if (!coverImage && images.length > 0) {
      coverImage = images[0]
    }

    return {
      id,
      ...(matterResult.data as Omit<WriteupMetadata, "id">),
      coverImage,
    }
  })

  // Sort by date, newest first
  return allWriteupsData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/**
 * Get single writeup data including full content and images
 */
export function getWriteupData(id: string): Writeup {
  // Convert ID back to folder path
  const folderParts = id.split("-")
  let folderPath = writeupsDirectory

  // Try to find the folder by reconstructing the path
  for (let i = 0; i < folderParts.length; i++) {
    const testPath = path.join(
      writeupsDirectory,
      ...folderParts.slice(0, i + 1)
    )
    if (fs.existsSync(testPath) && fs.statSync(testPath).isDirectory()) {
      folderPath = testPath
    }
  }

  // If we can't find the exact folder, search recursively
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    const allFolders = findWriteupFolders(writeupsDirectory)
    const matchingFolder = allFolders.find(
      (folder) => getWriteupId(folder) === id
    )
    if (!matchingFolder) {
      throw new Error(`Writeup with ID ${id} not found`)
    }
    folderPath = matchingFolder

    if (!folderPath) {
      throw new Error(`Writeup with ID ${id} not found`)
    }
  }

  const mdFilePath = getMarkdownFile(folderPath)
  const fileContents = fs.readFileSync(mdFilePath, "utf8")
  const matterResult = matter(fileContents)
  const images = getWriteupImages(folderPath)

  // Try to find a cover image (either specified in frontmatter or use the first image)
  let coverImage = matterResult.data.coverImage
  if (!coverImage && images.length > 0) {
    coverImage = images[0]
  }

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as Omit<WriteupMetadata, "id">),
    coverImage,
    images,
  }
}
