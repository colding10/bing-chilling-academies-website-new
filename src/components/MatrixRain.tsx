"use client"

import { useEffect, useRef, useCallback, memo } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

// Matrix rain performance configuration
const CONFIG = {
  fontSize: 14,
  // Use half-width katakana for better rendering
  charSet: "01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ",
  colors: [
    "rgba(0, 255, 249, 0.8)", // Bright cyan
    "rgba(0, 200, 190, 0.7)", // Medium cyan
    "rgba(0, 150, 140, 0.6)", // Dark cyan
  ],
  mobileFrameDelay: 100, // ms between frames (10 FPS)
  desktopFrameDelay: 80, // ms between frames (12.5 FPS)
  mobileFadeOpacity: 0.1,
  desktopFadeOpacity: 0.05,
  dropSpeed: {
    mobile: 0.5,
    desktop: 0.8,
  },
  maxColumns: 300, // Prevent excessive columns on wide screens
}

export default memo(function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { effectsMode, matrixOpacity, isLoadingComplete } =
    useBackgroundEffects()
  const animationRef = useRef<number | null>(null)
  const dropsRef = useRef<number[]>([])
  const isMobileRef = useRef<boolean>(false)

  // Only render when both conditions are met
  const actualOpacity =
    matrixOpacity > 0 && effectsMode !== "none" ? matrixOpacity : 0

  // Create a memoized draw function to prevent recreation on each render
  const createDrawFunction = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return () => {}

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return () => {}

    const fadeOpacity = isMobileRef.current
      ? CONFIG.mobileFadeOpacity
      : CONFIG.desktopFadeOpacity
    const dropSpeed = isMobileRef.current
      ? CONFIG.dropSpeed.mobile
      : CONFIG.dropSpeed.desktop
    const { fontSize, colors } = CONFIG
    const charArray = CONFIG.charSet.split("")

    // Reference drops array directly from ref
    const drops = dropsRef.current

    // Pre-allocate variables to avoid creating them in the loop
    let text: string
    let colorIndex: number

    return function draw() {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties once outside the loop with simpler font stack
      ctx.font = `${fontSize}px "MS Gothic", monospace`
      ctx.textBaseline = "top"

      for (let i = 0; i < drops.length; i++) {
        // Get random character from the array
        text = charArray[Math.floor(Math.random() * charArray.length)]

        // Select color based on position for visual variation
        colorIndex = Math.floor((drops[i] / canvas.height) * colors.length)
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
  }, [])

  // Handle window resize efficiently
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Apply devicePixelRatio for sharp rendering on high-DPI screens
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr

    // Scale back with CSS
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    // Scale the context
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // Calculate columns based on visible width with a maximum
    const { fontSize, maxColumns } = CONFIG
    const newColumns = Math.min(
      Math.floor(window.innerWidth / fontSize),
      maxColumns
    )

    // Resize drops array efficiently - reuse if possible
    if (newColumns > dropsRef.current.length) {
      // Expand drops array
      const additionalDrops = Array(newColumns - dropsRef.current.length).fill(
        1
      )
      dropsRef.current = [...dropsRef.current, ...additionalDrops]
    } else if (newColumns < dropsRef.current.length) {
      // Truncate array to save memory
      dropsRef.current.length = newColumns
    }
  }, [])

  useEffect(() => {
    // Skip initialization when component should not be visible
    if (!isLoadingComplete || actualOpacity <= 0) return

    // Detect mobile device once
    isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Set up canvas
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize drops array if empty
    if (dropsRef.current.length === 0) {
      const { fontSize, maxColumns } = CONFIG
      const columns = Math.min(
        Math.floor(window.innerWidth / fontSize),
        maxColumns
      )
      dropsRef.current = Array(columns).fill(1)
    }

    // Initial resize
    handleResize()

    // Create draw function
    const draw = createDrawFunction()

    // Frame timing control
    const frameDelay = isMobileRef.current
      ? CONFIG.mobileFrameDelay
      : CONFIG.desktopFrameDelay
    let lastFrameTime = 0

    // Animation loop with frame rate control
    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate)

      // Only render at specified intervals
      if (currentTime - lastFrameTime >= frameDelay) {
        draw()
        lastFrameTime = currentTime
      }
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Add resize listener with passive flag for better performance
    window.addEventListener("resize", handleResize, { passive: true })

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [
    actualOpacity,
    effectsMode,
    isLoadingComplete,
    createDrawFunction,
    handleResize,
  ])

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
