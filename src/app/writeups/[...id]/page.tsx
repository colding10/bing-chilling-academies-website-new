// File: page.tsx (Writeup Detail)

import { Writeup } from "@/lib/writeups";
import WriteupContent from "./WriteupContent";

// Server Component with params type
// Using 'any' type to bypass Next.js PageProps constraint issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: { params: any }) {
  // Server-side data fetching
  const path = Array.isArray(params.id) ? params.id.join("/") : params.id;
  
  let writeup: Writeup | null = null;
  const isLoading = false;
  
  try {
    // Perform server-side data fetching
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/writeups/${path}`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      console.error(`Error fetching writeup: ${response.status} ${response.statusText}`);
    } else {
      writeup = await response.json() as Writeup;
    }
  } catch (error) {
    console.error("Error fetching writeup:", error);
  }
  
  // Render the client component with the fetched data
  return <WriteupContent writeup={writeup} isLoading={isLoading} />;
}
