"use client"

import { useEffect, useRef, memo } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  update: (width: number, height: number) => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

export default memo(function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameIdRef = useRef<number | null>(null)
  const { particlesEnabled, isLoadingComplete } = useBackgroundEffects()

  useEffect(() => {
    // Don't initialize if particles are disabled or loading isn't complete
    if (!particlesEnabled || !isLoadingComplete) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const updateCanvasSize = () => {
      if (!canvas) return

      // Use device pixel ratio for sharper rendering on high-DPI displays
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr

      // Scale the drawing context
      ctx.scale(dpr, dpr)

      // Set CSS size separately
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    updateCanvasSize()

    // Optimize for mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Adjust particle count based on screen size and device type
    const particleCount = isMobile ? 25 : window.innerWidth < 768 ? 35 : 50

    // Initialize particles array
    const particles: Particle[] = []

    // Pre-calculate these values to improve performance
    const connectionDistance = 100
    const connectionDistanceSquared = connectionDistance * connectionDistance

    class ParticleClass implements Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string

      constructor() {
        // Random position within canvas
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight

        // Random velocity (slower on mobile for better performance)
        const speed = isMobile ? 0.2 : 0.3
        this.vx = (Math.random() - 0.5) * speed
        this.vy = (Math.random() - 0.5) * speed

        // Randomize particle size slightly
        this.size = Math.random() * 1 + 1

        // Use a consistent color for better performance
        this.color = "rgba(0, 255, 249, 0.8)"
      }

      update(width: number, height: number) {
        // Move particle
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges with a bit of randomization to avoid patterns
        if (this.x < 0 || this.x > width) {
          this.vx = -this.vx * (0.9 + Math.random() * 0.1)

          // Reset position if they somehow get way outside the viewport
          if (this.x < -50 || this.x > width + 50) {
            this.x = Math.random() * width
          }
        }

        if (this.y < 0 || this.y > height) {
          this.vy = -this.vy * (0.9 + Math.random() * 0.1)

          // Reset position if they somehow get way outside the viewport
          if (this.y < -50 || this.y > height + 50) {
            this.y = Math.random() * height
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    function initParticles() {
      particles.length = 0 // Clear existing particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(new ParticleClass())
      }
    }

    // Initialize particles
    initParticles()

    // Use a timestamp for frame throttling
    let lastFrameTime = 0
    const minFrameDelay = isMobile ? 30 : 16 // ~30fps on mobile, ~60fps otherwise

    // Optimize drawing function
    function animate(timestamp: number) {
      // Only render if enough time has passed (throttle frame rate)
      if (timestamp - lastFrameTime >= minFrameDelay) {
        lastFrameTime = timestamp

        if (!ctx || !canvas) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update and draw each particle
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i]
          particle.update(window.innerWidth, window.innerHeight)
          particle.draw(ctx)
        }

        // Draw connections between particles that are close enough
        // Optimize by checking squared distance and doing fewer comparisons
        for (let i = 0; i < particles.length; i++) {
          const particleA = particles[i]
          // Only check half the particles (each connection would otherwise be drawn twice)
          for (let j = i + 1; j < particles.length; j++) {
            const particleB = particles[j]
            const dx = particleA.x - particleB.x
            const dy = particleA.y - particleB.y
            const distanceSquared = dx * dx + dy * dy

            if (distanceSquared < connectionDistanceSquared) {
              // Calculate opacity based on distance (closer = more opaque)
              const opacity =
                1 - Math.sqrt(distanceSquared) / connectionDistance
              ctx.beginPath()
              ctx.strokeStyle = `rgba(0, 255, 249, ${opacity * 0.5})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particleA.x, particleA.y)
              ctx.lineTo(particleB.x, particleB.y)
              ctx.stroke()
            }
          }
        }
      }

      // Request next frame
      animationFrameIdRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameIdRef.current = requestAnimationFrame(animate)

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize()
      // Optional: re-initialize particles on window resize
      // initParticles()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [particlesEnabled, isLoadingComplete])

  // Don't render at all if particles are disabled or during loading
  if (!particlesEnabled || !isLoadingComplete) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  )
})
