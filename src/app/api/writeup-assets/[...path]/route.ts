import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const writeupsDirectory = path.join(process.cwd(), "_writeups");

    // Extract the URL directly from the request
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    // Remove 'api' and 'writeup-assets' from the path segments
    const assetPathSegments = pathSegments.slice(2); // Skip 'api' and 'writeup-assets'

    // Validate and sanitize the path to prevent path injection
    const sanitizedPath = assetPathSegments.map((segment) => {
      if (segment.includes("..") || path.isAbsolute(segment)) {
        throw new Error("Invalid path segment");
      }
      return segment;
    });

    // Resolve the asset path
    const assetPath = resolveAssetPath(writeupsDirectory, sanitizedPath);

    // Check if the file exists
    if (!fs.existsSync(assetPath)) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Read the file and determine its content type
    const fileBuffer = fs.readFileSync(assetPath);
    const contentType = getContentType(assetPath);

    // Serve the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error serving asset:", error);
    return NextResponse.json(
      { error: "Failed to serve asset" },
      { status: 500 }
    );
  }
}

// Helper function to resolve the asset path
function resolveAssetPath(baseDir: string, pathParts: string[]): string {
  // Normalize the base directory to ensure consistent path resolution
  const normalizedBaseDir = path.resolve(baseDir);

  // Join the sanitized path parts to form the relative path
  const relativePath = path.join(...pathParts);

  // Resolve the full path
  const fullPath = path.resolve(normalizedBaseDir, relativePath);

  // Ensure the resolved path is within the base directory to prevent path traversal
  if (!fullPath.startsWith(normalizedBaseDir)) {
    throw new Error("Resolved path is outside the base directory");
  }

  return fullPath;
}

// Helper function to determine content type based on file extension
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
