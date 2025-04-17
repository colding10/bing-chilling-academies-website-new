import { NextResponse } from "next/server";
import { getWriteupData } from "@/lib/writeups";
import { remark } from "remark";
import html from "remark-html";

export async function GET(request: Request) {
  try {
    // Extract path segments directly from the request URL string
    const url = new URL(request.url);
    const pathname = url.pathname;
    const pathSegments = pathname.split("/").filter(Boolean);

    // Remove 'api' and 'writeups' from the path segments
    const idSegments = pathSegments.slice(2); // Skip 'api' and 'writeups'

    // Join the segments with '/'
    const writeupId = idSegments.join("/");

    console.log(`Attempting to fetch writeup with ID: ${writeupId}`);
    console.log(`Full pathname: ${pathname}`);
    console.log(`Path segments: ${JSON.stringify(pathSegments)}`);
    console.log(`ID segments: ${JSON.stringify(idSegments)}`);

    // Get the writeup data
    const writeupData = await getWriteupData(writeupId);

    if (!writeupData) {
      console.error(`Writeup with ID ${writeupId} not found`);
      return NextResponse.json({ error: "Writeup not found" }, { status: 404 });
    }

    // Process markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(writeupData.content);
    const contentHtml = processedContent.toString();

    return NextResponse.json({
      ...writeupData,
      content: contentHtml,
    });
  } catch (error) {
    console.error(
      `Error handling request: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    console.error(
      `Error stack: ${
        error instanceof Error ? error.stack : "No stack trace available"
      }`
    );
    return NextResponse.json({ error: "Writeup not found" }, { status: 404 });
  }
}
