"use client"

import { useState, useEffect, memo } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { ThemeProvider } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { BackgroundEffectsProvider } from "@/contexts/BackgroundEffectsContext"

// Dynamically import heavy components with loading disabled
// This improves initial load time by only loading them when needed
const MatrixRain = dynamic(() => import("./MatrixRain"), { ssr: false })
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false })
const GlobalEffects = dynamic(() => import("./GlobalEffects"), { ssr: false })

// Optimize the Layout component with memoization
export default memo(function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use state to track if the component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false)

  // After first render (client-side), set mounted to true
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <ThemeProvider attribute="class">
      <BackgroundEffectsProvider>
        <div className="min-h-screen cyber-grid relative">
          {/* Only render visual effects when client-side mounted */}
          {isMounted && (
            <>
              <MatrixRain />
              <ParticleField />
              <GlobalEffects />
            </>
          )}
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto px-4 py-8"
            >
              {isMounted ? children : <div className="h-screen"></div>}
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </BackgroundEffectsProvider>
    </ThemeProvider>
  )
})
