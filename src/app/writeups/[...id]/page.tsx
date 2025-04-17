// File: page.tsx (Writeup Detail)

import { Writeup } from "@/lib/writeups";
import WriteupContent from "./WriteupContent";

// Server Component with params type
// Properly type the params for [...id] route
interface WriteupPageParams {
  id: string[];
}

export default async function Page({
  params,
}: {
  params: Promise<WriteupPageParams> | WriteupPageParams;
}) {
  // Server-side data fetching
  // In Next.js 15, we need to await params before accessing its properties
  const resolvedParams = await params;
  const path = resolvedParams.id.join("/");

  let writeup: Writeup | null = null;
  const isLoading = false;

  try {
    // Create a proper absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = new URL(`/api/writeups/${path}`, baseUrl);

    // Use the absolute URL for the fetch request
    const response = await fetch(url.toString(), {
      cache: "no-store", // Disable caching for the request
    });

    if (!response.ok) {
      console.error(
        `Error fetching writeup: ${response.status} ${response.statusText}`
      );
    } else {
      writeup = (await response.json()) as Writeup;
    }
  } catch (error) {
    console.error("Error fetching writeup:", error);
  }

  // Render the client component with the fetched data
  return <WriteupContent writeup={writeup} isLoading={isLoading} />;
}
