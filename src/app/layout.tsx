import type { Metadata } from "next"
import { Orbitron, Share_Tech_Mono, Play } from "next/font/google"
import "./globals.css"
import Layout from "@/components/Layout"
import React from "react"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
})

const play = Play({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-play",
})

export const metadata: Metadata = {
  title: "Bing Chilling Academies",
  description: "A group of high schoolers who like ice cream and cybersecurity",
  metadataBase: new URL("https://bingchillingacademies.com"),
  // Google site verification
  verification: {
    google: "uU0GU3gPz6MyAeCJvSB0JhEMYNd8ayZVoZ6wvu1yU5w",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${shareTechMono.variable} ${play.variable}`}
        suppressHydrationWarning
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
