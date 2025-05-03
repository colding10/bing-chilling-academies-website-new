"use client"
import Prism from "prismjs"
import React, { useEffect } from "react"
// Import prism core and languages - these will be handled by webpack
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-python"
import "prismjs/components/prism-bash"

export default function RootLayout({ children }) {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bing Chilling Academies</title>
        {/* Removed manual CSS/script tags since we're importing them via webpack */}
      </head>
      <body>{children}</body>
    </html>
  )
}
