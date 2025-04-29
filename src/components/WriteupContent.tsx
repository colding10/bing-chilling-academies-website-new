import React from "react"
import Link from "next/link"
import Image from "next/image"

interface WriteupContentProps {
  children: React.ReactNode
}

export default function WriteupContent({ children }: WriteupContentProps) {
  return (
    <div className="writeup-content bg-custom-black/80 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      {children}
    </div>
  )
}
