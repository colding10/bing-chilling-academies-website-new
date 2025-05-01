"use client"

import { useState, useEffect, memo } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { ThemeProvider } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { BackgroundEffectsProvider } from "@/contexts/BackgroundEffectsContext"

// Dynamically import heavy visual components to improve initial load time
const MatrixRain = dynamic(() => import("./MatrixRain"), {
  ssr: false,
  loading: () => null,
})

const ParticleField = dynamic(() => import("./ParticleField"), {
  ssr: false,
  loading: () => null,
})

const GlobalEffects = dynamic(() => import("./GlobalEffects"), {
  ssr: false,
  loading: () => null,
})

// Optimize with memo to prevent unnecessary re-renders
export default memo(function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // Track client-side mounting to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Signal to background effects that loading is complete
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const event = new CustomEvent("layoutMounted", {
          detail: { mounted: true },
        })
        window.dispatchEvent(event)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Avoid rendering certain components during SSR
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
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
