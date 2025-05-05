import { Orbitron, Share_Tech_Mono, Play } from "next/font/google"
import "@/styles/critical.css"
import "./globals.css"
import Layout from "@/components/Layout"
import React from "react"
import type { Metadata, Viewport } from "next/types"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  display: "swap",
})

const play = Play({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-play",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Bing Chilling Academies | CTF Team",
  description:
    "A group of high schoolers from the bing chilling academies who like ice cream and solving CTF challenges",
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0ffff9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add proper font-face definition for Japanese characters */}
        <style dangerouslySetInnerHTML={{__html: `
          @font-face {
            font-family: 'MS Gothic';
            src: url('/fonts/MS-Gothic.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}} />
        
        {/* Preload fonts for Japanese characters */}
        <link
          rel="preload"
          href="/fonts/MS-Gothic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://ctftime.org" />
      </head>
      <body
        className={`${orbitron.variable} ${shareTechMono.variable} ${play.variable} min-h-screen cyber-bg scrollbar-custom`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
