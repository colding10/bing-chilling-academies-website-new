"use client"

import { useEffect, useRef, memo } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  update: (width: number, height: number) => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

export default memo(function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    class ParticleClass implements Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number

      constructor(width: number, height: number) {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 2 + 0.1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
      }

      update(width: number, height: number) {
        this.x += this.speedX
        if (this.x > width) this.x = 0
        if (this.x < 0) this.x = width

        this.y += this.speedY
        if (this.y > height) this.y = 0
        if (this.y < 0) this.y = height
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#00fff9"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    const particleCount = 50

    function initParticles() {
      if (!ctx || !canvas) return
      particles.length = 0 // Clear existing particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(new ParticleClass(canvas.width, canvas.height))
      }
    }

    // Pre-calculate distances less frequently to improve performance
    const connectionDistance = 100
    const connectionDistanceSquared = connectionDistance * connectionDistance

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw each particle
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height)
        particle.draw(ctx)
      })

      // Optimize connection drawing with distance squared comparison
      // to avoid expensive square root calculations
      for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const particleB = particles[j]
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distanceSquared = dx * dx + dy * dy

          if (distanceSquared < connectionDistanceSquared) {
            const opacity = 1 - Math.sqrt(distanceSquared) / connectionDistance
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 255, 249, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    initParticles()
    const animationFrameId = requestAnimationFrame(animate)

    const handleResize = () => {
      updateCanvasSize()
      initParticles() // Reinitialize particles on resize
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
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: -1 }}
    />
  )
})
