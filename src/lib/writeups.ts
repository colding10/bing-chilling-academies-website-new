import fs from "fs"
import path from "path"
import matter from "gray-matter"

const writeupsDirectory = path.join(process.cwd(), "_writeups")

export interface WriteupMetadata {
  id: string;
  title: string;
  ctfName: string;
  date: string;
  tags: string[];
  description: string;
  author: string;
}

export interface Writeup extends WriteupMetadata {
  content: string;
}

// Cache for getAllWriteups with proper typing
interface WriteupCache {
  writeups: WriteupMetadata[];
  timestamp: number;
}

let writeupCache: WriteupCache | null = null;
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Cache for individual writeup content with proper typing
interface WriteupContentCache {
  data: Writeup;
  timestamp: number;
}

const writeupContentCache = new Map<string, WriteupContentCache>();

/**
 * Recursively searches directories to find writeup folders
 * A valid writeup folder contains a markdown file (usually main.md)
 * Performance optimized with memoization
 */
const folderCache = new Map<string, string[]>();
const FOLDER_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
let lastFolderCacheTime = 0;

function findWriteupFolders(dir: string): string[] {
  const now = Date.now();
  
  // Return cached results if valid
  if (folderCache.has(dir) && now - lastFolderCacheTime < FOLDER_CACHE_TTL) {
    return folderCache.get(dir) || [];
  }
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const folders: string[] = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Check if this folder directly contains a markdown file
        const markdownFile = getMarkdownFile(fullPath);
        if (markdownFile) {
          folders.push(fullPath);
        } else {
          // Recursively check subfolders
          folders.push(...findWriteupFolders(fullPath));
        }
      }
    }
    
    // Update cache
    folderCache.set(dir, folders);
    lastFolderCacheTime = now;
    
    return folders;
  } catch (error) {
    console.error(`Error finding writeup folders in ${dir}:`, error);
    return [];
  }
}

/**
 * Gets the ID for a writeup folder based on its path
 */
function getWriteupId(folderPath: string): string {
  // Normalize path separators for consistent IDs
  return path.relative(writeupsDirectory, folderPath).replace(/\\/g, "/");
}

/**
 * Find the primary markdown file in a writeup folder
 * Optimized to check for common filenames first
 */
function getMarkdownFile(folderPath: string): string | null {
  try {
    // Common filenames to check first for optimization
    const commonFiles = ['main.md', 'index.md', 'README.md', 'writeup.md'];
    
    for (const filename of commonFiles) {
      const filePath = path.join(folderPath, filename);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    
    // If no common files found, check all markdown files
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory() && entry.name.endsWith('.md')) {
        return path.join(folderPath, entry.name);
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error finding markdown file in ${folderPath}:`, error);
    return null;
  }
}

/**
 * Get metadata for all writeups with improved error handling and caching
 */
export function getAllWriteups(): WriteupMetadata[] {
  // Return cached results if available and not expired
  const now = Date.now();
  if (writeupCache && now - writeupCache.timestamp < CACHE_TTL) {
    return writeupCache.writeups;
  }

  try {
    const writeupFolders = findWriteupFolders(writeupsDirectory);
    
    const writeups = writeupFolders
      .map((folderPath) => {
        try {
          const mdFile = getMarkdownFile(folderPath);
          if (!mdFile) return null;
          
          const id = getWriteupId(folderPath);
          
          // Read file content once and reuse
          const fileContents = fs.readFileSync(mdFile, "utf8");
          const { data } = matter(fileContents);
          
          // Validate and provide defaults for required fields
          return {
            id,
            title: data.title || path.basename(folderPath),
            ctfName: data.ctfName || "Unknown CTF",
            date: data.date || new Date().toISOString(),
            tags: Array.isArray(data.tags) ? data.tags : [],
            description: data.description || "",
            author: data.author || "Anonymous",
          };
        } catch (error) {
          console.error(`Error processing writeup folder ${folderPath}:`, error);
          return null;
        }
      })
      .filter((item): item is WriteupMetadata => item !== null);
    
    // Sort by date descending (newest first)
    const sortedWriteups = writeups.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Update cache
    writeupCache = {
      writeups: sortedWriteups,
      timestamp: now
    };
    
    return sortedWriteups;
  } catch (error) {
    console.error("Error in getAllWriteups:", error);
    
    // Return empty array instead of throwing to avoid breaking the page
    return [];
  }
}

/**
 * Get a specific writeup by ID with content
 * Improved with better error handling and caching
 */
export async function getWriteupData(id: string): Promise<Writeup | null> {
  try {
    const now = Date.now();
    
    // Check cache first
    const cached = writeupContentCache.get(id);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    // Get the folder path from the ID
    const folderPath = path.join(writeupsDirectory, id);
    
    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      console.error(`Writeup folder not found: ${folderPath}`);
      return null;
    }
    
    // Find the markdown file
    const mdFile = getMarkdownFile(folderPath);
    if (!mdFile) {
      console.error(`No markdown file found in ${folderPath}`);
      return null;
    }
    
    // Read the file and parse with gray-matter
    const fileContents = fs.readFileSync(mdFile, "utf8");
    const { data, content } = matter(fileContents);
    
    // Create the writeup object
    const writeup: Writeup = {
      id,
      title: data.title || path.basename(folderPath),
      ctfName: data.ctfName || "Unknown CTF",
      date: data.date || new Date().toISOString(),
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description || "",
      author: data.author || "Anonymous",
      content,
    };
    
    // Update cache
    writeupContentCache.set(id, {
      data: writeup,
      timestamp: now
    });
    
    return writeup;
  } catch (error) {
    console.error(`Error getting writeup data for ${id}:`, error);
    return null;
  }
}
