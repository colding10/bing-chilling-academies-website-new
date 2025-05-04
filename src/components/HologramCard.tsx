"use client"

import { motion } from "framer-motion"
import { useState, useCallback, memo } from "react"

interface HologramCardProps {
  children: React.ReactNode
  className?: string
}

export default memo(function HologramCard({
  children,
  className = "",
}: HologramCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Use useCallback to prevent unnecessary re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    })
  }, [])

  // Create a minimal version of the gradient style to avoid animation overhead
  const gradientStyle = {
    backgroundImage: `radial-gradient(
      circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%,
      rgba(0, 255, 249, 0.1) 0%,
      transparent 50%
    )`,
  }

  return (
    <motion.div
      className={`relative overflow-hidden bg-custom-black/60 border border-custom-blue/30 
      rounded-lg backdrop-blur-sm ${className}`}
      onMouseMove={handleMouseMove}
      style={gradientStyle}
      whileHover={{ borderColor: "rgba(32, 141, 214, 0.6)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative z-10 p-6">{children}</div>
      <div className="absolute inset-0 hologram-lines" />
    </motion.div>
  )
})
