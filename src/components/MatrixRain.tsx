"use client"

import { useEffect, useRef, memo } from "react"

export default memo(function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

      // Use a more efficient opacity approach
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0ff"
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
      for (let i = columns; i < newColumns; i++) {
        drops[i] = 1
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20"
      style={{ zIndex: -1 }}
    />
  )
})
