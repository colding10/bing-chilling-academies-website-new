"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

export default function GlobalEffects() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const { scanLinesEnabled, setIsLoadingComplete, effectsMode } =
    useBackgroundEffects()

  // Handle page transitions and loading state
  useEffect(() => {
    // Set loading state to true when navigating
    setIsLoading(true)

    // Reset the global loading complete state
    setIsLoadingComplete(false)

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Update the global loading state after loading is complete
      setIsLoadingComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname, setIsLoadingComplete])

  return (
    <>
      {/* Scanlines Overlay - conditional based on settings (z-index 5, below matrix rain) */}
      {scanLinesEnabled && (
        <div
          className="scanlines fixed inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
        />
      )}

      {/* Matrix Rain - only render when effectsMode is not 'none' */}
      {effectsMode !== "none" && (
        <div id="matrix-container" className="fixed inset-0 z-[-1]">
          {/* MatrixRain component is conditionally rendered here through its own logic */}
        </div>
      )}

      {/* Page Transition */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-custom-black z-[100] flex items-center justify-center"
          >
            <div className="cyber-loading">
              <span
                className="text-custom-blue font-orbitron text-2xl glitch-text"
                data-text="LOADING"
              >
                LOADING
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
