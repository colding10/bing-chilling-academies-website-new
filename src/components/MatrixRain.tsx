"use client"

import { useEffect, useRef, memo } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

export default memo(function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { effectsMode, matrixOpacity, isLoadingComplete } =
    useBackgroundEffects()
  const animationRef = useRef<number | null>(null)

  // Performance optimization: don't render if opacity is 0 or during loading
  const actualOpacity =
    matrixOpacity > 0 && effectsMode !== "none" ? matrixOpacity : 0

  useEffect(() => {
    // Only initialize when loading is complete and opacity is greater than 0
    if (!isLoadingComplete || actualOpacity <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Set initial canvas size
    const updateCanvasSize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    // Japanese-style characters for more authentic matrix rain
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const charArray = chars.split("")
    const fontSize = 14

    // Performance optimization: limit columns based on screen width
    const maxColumns = 200 // Set a reasonable upper limit
    const columns = Math.min(
      Math.floor(window.innerWidth / fontSize),
      maxColumns
    )

    // Initialize drop positions
    const drops: number[] = new Array(columns).fill(1)

    // Performance config - adjust based on device capability
    const isMobile =
      typeof window !== "undefined" &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const frameDelay = isMobile ? 100 : 80 // More delay (slower) on mobile
    const dropSpeed = isMobile ? 0.5 : 0.8 // Slower drops on mobile
    let lastFrameTime = 0

    // Draw frame with performance optimizations
    function draw() {
      if (!ctx || !canvas) return

      // Semi-transparent black to create fade effect - adjust opacity for performance
      ctx.fillStyle = `rgba(0, 0, 0, ${isMobile ? 0.1 : 0.05})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties once outside the loop
      ctx.font = `${fontSize}px monospace`

      // Use fewer colors for better performance
      const colors = [
        "rgba(0, 255, 249, 0.8)", // Bright teal
        "rgba(0, 200, 190, 0.8)", // Medium teal
        "rgba(0, 150, 140, 0.7)", // Dark teal
      ]

      for (let i = 0; i < drops.length; i++) {
        // Select a random character from the array
        const text = charArray[Math.floor(Math.random() * charArray.length)]

        // Select a color based on position (creates a subtle effect)
        const colorIndex = Math.floor(
          (drops[i] / canvas.height) * colors.length
        )
        ctx.fillStyle = colors[colorIndex] || colors[0]

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset drop when it reaches the bottom or randomly for variation
        if (drops[i] * fontSize > canvas.height || Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drop down by dropSpeed
        drops[i] += dropSpeed
      }
    }

    // Animation loop with frame rate limiting for better performance
    function animate(currentTime: number) {
      animationRef.current = requestAnimationFrame(animate)

      // Only draw if enough time has passed since the last frame
      if (currentTime - lastFrameTime >= frameDelay) {
        draw()
        lastFrameTime = currentTime
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize()

      // Recalculate columns and reset drops on resize
      const newColumns = Math.min(
        Math.floor(window.innerWidth / fontSize),
        maxColumns
      )

      // Reuse existing array if possible to avoid garbage collection
      if (newColumns > drops.length) {
        // Extend the array with new drops
        const additionalDrops = new Array(newColumns - drops.length).fill(1)
        drops.push(...additionalDrops)
      } else {
        // Truncate the array
        drops.length = newColumns
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup function to prevent memory leaks
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [actualOpacity, effectsMode, isLoadingComplete])

  // Don't render at all if opacity is 0 or during loading
  if (actualOpacity <= 0 || !isLoadingComplete) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 10,
        opacity: actualOpacity,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      aria-hidden="true"
    />
  )
})
