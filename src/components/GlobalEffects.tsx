"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, memo } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

export default memo(function GlobalEffects() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const { setIsLoadingComplete, effectsMode } = useBackgroundEffects()

  // Handle page transitions and loading state
  useEffect(() => {
    // Set loading to true when route changes
    setIsLoading(true)

    // Capture start time for minimum duration
    const startTime = Date.now()

    // Define minimum loading duration to avoid flashing
    const MIN_LOADING_DURATION = 800

    // Handle loading timing and completion
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setIsLoadingComplete(true), 100)
    }, MIN_LOADING_DURATION)

    return () => {
      clearTimeout(timer)
      setIsLoadingComplete(false)
    }
  }, [pathname, setIsLoadingComplete])

  return (
    <>
      {/* Scanlines Overlay - only show if effects are enabled */}
      {effectsMode !== "none" && (
        <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-30" />
      )}

      {/* Page Transition */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-custom-black z-[100] flex items-center justify-center"
          >
            <div className="cyber-loading flex flex-col items-center">
              <motion.span
                className="text-custom-blue font-orbitron text-3xl glitch-text mb-4"
                data-text="LOADING"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                LOADING
              </motion.span>

              {/* Loading bar animation */}
              <motion.div
                className="w-64 h-1 bg-custom-black overflow-hidden rounded relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-custom-blue via-custom-pink to-custom-yellow absolute left-0 top-0"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})
