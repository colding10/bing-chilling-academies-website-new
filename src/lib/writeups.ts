import fs from "fs";
import path from "path";
import matter from "gray-matter";

const writeupsDirectory = path.join(process.cwd(), "_writeups");

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

// Helper function to find all markdown files recursively
function findMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith(".md")) {
      // Store path relative to the writeups directory
      fileList.push(path.relative(writeupsDirectory, filePath));
    }
  });

  return fileList;
}

export function getAllWriteups(): WriteupMetadata[] {
  const markdownFiles = findMarkdownFiles(writeupsDirectory);

  const allWriteupsData = markdownFiles.map((relativeFilePath) => {
    const id = relativeFilePath.replace(/\.md$/, "").replace(/\\/g, "/");
    const fullPath = path.join(writeupsDirectory, relativeFilePath);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as Omit<WriteupMetadata, "id">),
    };
  });

  return allWriteupsData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
export async function getWriteupData(id: string): Promise<Writeup> {
  try {
    // Handle path separators in the id to find files in subdirectories
    const normalizedId = id.replace(/\//g, path.sep);
    const fullPath = path.join(writeupsDirectory, `${normalizedId}.md`);

    console.log(`Looking for file at: ${fullPath}`); // Debug log

    // Check if file exists before reading
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      content: matterResult.content,
      ...(matterResult.data as Omit<WriteupMetadata, "id">),
    };
  } catch (error) {
    console.error(`Error in getWriteupData: ${error}`);
    throw error;
  }
}
