import { NextResponse } from "next/server";
import { getWriteupData } from "@/lib/writeups";
import { remark } from "remark";
import html from "remark-html";

export async function GET(request: Request) {
  try {
    // Extract the URL directly from the request
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    // Remove 'api' and 'writeups' from the path segments
    const idSegments = pathSegments.slice(2); // Skip 'api' and 'writeups'

    // Join the segments with '/'
    const writeupId = idSegments.join("/");

    console.log(`Fetching writeup with ID: ${writeupId}`);

    const writeupData = await getWriteupData(writeupId);

    const processedContent = await remark()
      .use(html)
      .process(writeupData.content);
    const contentHtml = processedContent.toString();

    return NextResponse.json({
      ...writeupData,
      content: contentHtml,
    });
  } catch (error) {
    console.error(`Error handling request: ${error}`);
    return NextResponse.json({ error: "Writeup not found" }, { status: 404 });
  }
}
