import React, { useRef, useEffect, useContext } from "react"
import { MatrixContext } from "./MatrixContext"

const MatrixRainBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { matrixOpacity } = useContext(MatrixContext)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    let animationFrameId: number

    const render = () => {
      if (context) {
        context.fillStyle = "rgba(0, 0, 0, 0.05)"
        context.fillRect(0, 0, canvas.width, canvas.height)
        // ...existing code...
      }
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Apply opacity based on the context value
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.opacity = matrixOpacity.toString()
    }
  }, [matrixOpacity])

  return <canvas ref={canvasRef} />
}

export default MatrixRainBackground
