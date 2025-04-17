"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function GlobalEffects() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {/* Scanlines Overlay */}
      <div className="scanlines fixed inset-0 pointer-events-none z-50" />

      {/* Page Transition */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-custom-black z-50 flex items-center justify-center"
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
