"use client"

import { useEffect, useRef, memo } from "react"

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

// Separate component that always uses hooks
const MatrixRainEffect = ({ opacity }: { opacity: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
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

    // Character set for matrix rain
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const charArray = chars.split("")
    const fontSize = 14
    const columns = Math.floor(window.innerWidth / fontSize)
    const drops: number[] = new Array(columns).fill(1)

    // Check for mobile device to optimize performance
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Frame rate control for better performance
    const frameDelay = isMobile ? 50 : 33 // Fewer frames on mobile
    let lastFrameTime = 0

    // Draw frame with performance optimizations
    function draw() {
      if (!ctx || !canvas) return

      // Semi-transparent black to create fade effect
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

        // Reset when a column reaches the bottom with some randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize()

      // Adjust the number of drops based on new width
      const newColumns = Math.floor(window.innerWidth / fontSize)

      // Expand if needed
      if (newColumns > drops.length) {
        drops.push(...new Array(newColumns - drops.length).fill(1))
      } else {
        // Truncate the array
        drops.length = newColumns
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

    // Start the animation
    animationRef.current = requestAnimationFrame(animate)

    // Add resize listener
    window.addEventListener("resize", handleResize)

    // Cleanup function to prevent memory leaks
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [opacity])

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
