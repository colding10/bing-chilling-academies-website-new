import { NextResponse } from "next/server"
import { getAllWriteups } from "@/lib/writeups"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://bingchillingacademies.vercel.app"
  const staticPaths = ["/", "/about", "/achievements", "/writeups"]
  const writeups = getAllWriteups()

  const urls = [
    ...staticPaths.map(path => `${baseUrl}${path}`),
    ...writeups.map(w => `${baseUrl}/writeups/${w.id}`)
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(loc => `  <url><loc>${loc}</loc></url>`).join("\n")}\n</urlset>`

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } })
}