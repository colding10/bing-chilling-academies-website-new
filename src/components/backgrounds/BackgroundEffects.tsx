import React from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"
import MatrixRainBackground from "./MatrixRainBackground"

const BackgroundEffects = () => {
  const { scanLinesEnabled, matrixOpacity } = useBackgroundEffects()

  return (
    <>
      <MatrixRainBackground opacity={matrixOpacity} />
      {scanLinesEnabled && <ScanLinesEffect />}
    </>
  )
}

const ScanLinesEffect = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background:
          "repeating-linear-gradient(transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)",
        opacity: 0.3, // Reduced opacity to make scan lines less distracting
        mixBlendMode: "overlay",
      }}
    />
  )
}

export default BackgroundEffects
