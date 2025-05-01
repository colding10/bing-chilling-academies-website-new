"use client"

import { useEffect, useRef, memo } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

export default memo(function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { effectsMode, matrixOpacity, isLoadingComplete } =
    useBackgroundEffects()

  // Simplified opacity - either 0.15 (barely visible) or 0 (not visible)
  const actualOpacity =
    typeof matrixOpacity === "number"
      ? matrixOpacity
      : effectsMode === "none"
        ? 0
        : 0.15

  useEffect(() => {
    // Don't initialize during loading or if opacity is 0
    if (!isLoadingComplete || actualOpacity <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set initial canvas size
    const updateCanvasSize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const charArray = chars.split("")
    const fontSize = 14
    const columns = Math.floor(window.innerWidth / fontSize)
    const drops: number[] = new Array(columns).fill(1)

    // Add speed control variables
    const frameDelay = 80 // Milliseconds between frames (higher = slower)
    const dropSpeed = 0.8 // How fast characters drop (lower = slower)
    let lastFrameTime = 0 // For frame rate control

    function draw() {
      if (!ctx || !canvas) return

      // Use a slightly darker background with more opacity
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Use a more visible green color for better contrast against dark backgrounds
      ctx.fillStyle = "rgba(0, 255, 170, 0.9)"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
          // Reduced probability of resetting
          drops[i] = 0
        }

        // Slow down the drop speed
        drops[i] += dropSpeed
      }
    }

    // Use requestAnimationFrame with frame rate limiting
    let animationFrameId: number

    function animate(currentTime: number) {
      animationFrameId = requestAnimationFrame(animate)

      // Only draw if enough time has passed since the last frame
      if (currentTime - lastFrameTime >= frameDelay) {
        draw()
        lastFrameTime = currentTime
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    const handleResize = () => {
      updateCanvasSize()
      // Recalculate columns and drops on resize
      const newColumns = Math.floor(window.innerWidth / fontSize)
      drops.length = newColumns
      for (let i = 0; i < newColumns; i++) {
        drops[i] = 1
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [actualOpacity, effectsMode, isLoadingComplete]) // Added isLoadingComplete dependency

  // Don't render at all if opacity is 0 or during loading
  if (actualOpacity <= 0 || !isLoadingComplete) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 10, // Set z-index to 10 - above scanlines but below main content
        opacity: actualOpacity,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  )
})
