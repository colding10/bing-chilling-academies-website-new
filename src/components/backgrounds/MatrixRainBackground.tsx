"use client"

import { useEffect, useRef, memo, useState, useCallback } from "react"

interface MatrixRainBackgroundProps {
  opacity?: number
}

// Wrapper component to handle early returns
const MatrixRainBackground = memo(
  ({ opacity = 0.2 }: MatrixRainBackgroundProps) => {
    // Render null early if opacity is 0 without breaking hook rules
    if (opacity <= 0) {
      return null
    }

    // Use a separate component for the actual implementation
    return <MatrixRainEffect opacity={opacity} />
  }
)

// Configuration for matrix rain
const MATRIX_CONFIG = {
  fontSize: 14,
  charSet:
    "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
  colors: [
    "rgba(0, 255, 249, 0.8)", // Bright teal
    "rgba(0, 200, 190, 0.8)", // Medium teal
    "rgba(0, 150, 140, 0.7)", // Dark teal
  ],
  mobileFrameDelay: 50, // ms between frames on mobile (20 FPS)
  desktopFrameDelay: 33, // ms between frames on desktop (30 FPS)
  mobileFadeOpacity: 0.1,
  desktopFadeOpacity: 0.05,
  dropResetProbability: 0.975, // Probability threshold to reset a drop
  maxColumns: 500, // Prevent excessive columns on very wide screens
}

// Separate component that always uses hooks
const MatrixRainEffect = ({ opacity }: { opacity: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const dropsRef = useRef<number[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Detect mobile once on mount
  const isMobile = useRef(
    typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  )

  // Create memoized draw function to prevent recreating on each render
  const createDrawFunction = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return () => {}

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return () => {}

    const { fontSize, colors } = MATRIX_CONFIG
    const charArray = MATRIX_CONFIG.charSet.split("")
    const fadeOpacity = isMobile.current
      ? MATRIX_CONFIG.mobileFadeOpacity
      : MATRIX_CONFIG.desktopFadeOpacity

    // Pre-allocate variables outside the draw loop
    let text: string
    let colorIndex: number
    const drops = dropsRef.current

    return function draw() {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties once outside the loop
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Select a random character from the array
        text = charArray[Math.floor(Math.random() * charArray.length)]

        // Select a color based on position
        colorIndex = Math.floor((drops[i] / canvas.height) * colors.length)
        ctx.fillStyle = colors[colorIndex] || colors[0]

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset when a column reaches the bottom with some randomness
        if (
          drops[i] * fontSize > canvas.height &&
          Math.random() > MATRIX_CONFIG.dropResetProbability
        ) {
          drops[i] = 0
        }

        drops[i]++
      }
    }
  }, [])

  // Resize handler is separate and memoized
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { fontSize, maxColumns } = MATRIX_CONFIG

    // Update canvas size with devicePixelRatio for sharper rendering on high-DPI screens
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr

    // Scale the canvas back down with CSS
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    // Scale the context to match
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // Calculate columns based on visible width
    const newColumns = Math.min(
      Math.floor(window.innerWidth / fontSize),
      maxColumns
    )

    // Get the current drops array
    const drops = dropsRef.current

    // Resize the drops array efficiently
    if (newColumns > drops.length) {
      // Add new drops
      const newDrops = new Array(newColumns - drops.length).fill(1)
      dropsRef.current = [...drops, ...newDrops]
    } else if (newColumns < drops.length) {
      // Remove extra drops
      dropsRef.current = drops.slice(0, newColumns)
    }
  }, [])

  // Setup animation loop with proper timing controls
  useEffect(() => {
    if (!canvasRef.current) return

    setIsMounted(true)
    const frameDelay = isMobile.current
      ? MATRIX_CONFIG.mobileFrameDelay
      : MATRIX_CONFIG.desktopFrameDelay

    // Initialize drops array if empty
    if (dropsRef.current.length === 0) {
      const { fontSize, maxColumns } = MATRIX_CONFIG
      const columns = Math.min(
        Math.floor(window.innerWidth / fontSize),
        maxColumns
      )
      dropsRef.current = new Array(columns).fill(1)
    }

    // Create the draw function
    const draw = createDrawFunction()
    let lastFrameTime = 0

    // Animation loop with efficient frame timing
    const animate = (currentTime: number) => {
      if (!isMounted) return

      animationRef.current = requestAnimationFrame(animate)

      // Only draw if enough time has passed since the last frame
      if (currentTime - lastFrameTime >= frameDelay) {
        draw()
        lastFrameTime = currentTime
      }
    }

    // Handle initial resize
    handleResize()

    // Start the animation
    animationRef.current = requestAnimationFrame(animate)

    // Add resize listener with passive flag for better performance
    window.addEventListener("resize", handleResize, { passive: true })

    // Cleanup function to prevent memory leaks
    return () => {
      setIsMounted(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      window.removeEventListener("resize", handleResize)
      // Clear references to free memory
      dropsRef.current = []
    }
  }, [createDrawFunction, handleResize, isMounted])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      aria-hidden="true"
    />
  )
}

MatrixRainBackground.displayName = "MatrixRainBackground"

export default MatrixRainBackground
