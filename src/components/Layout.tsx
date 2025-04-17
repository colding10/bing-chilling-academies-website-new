"use client"

import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { ThemeProvider } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import MatrixRain from "./MatrixRain"
import ParticleField from "./ParticleField"

export default function Layout({ children }: { children: React.ReactNode }) {
  // Use state to track if the component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false)

  // After first render (client-side), set mounted to true
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen cyber-grid relative">
        <MatrixRain />
        <ParticleField />
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8"
          >
            {isMounted ? children : <div className="h-screen"></div>}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
