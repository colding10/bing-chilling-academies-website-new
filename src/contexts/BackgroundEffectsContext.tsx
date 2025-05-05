"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type EffectsMode = "none" | "full"

interface BackgroundEffectsContextType {
  effectsMode: EffectsMode
  matrixOpacity: number
  scanLinesEnabled: boolean
  particlesEnabled: boolean
  isLoadingComplete: boolean
  toggleEffectsMode: () => void
  setEffectsMode: (mode: EffectsMode) => void
  setMatrixOpacity: (opacity: number) => void
  setScanLinesEnabled: (enabled: boolean) => void
  setParticlesEnabled: (enabled: boolean) => void
  setIsLoadingComplete: (complete: boolean) => void
}

// Create context with undefined initial value
const BackgroundEffectsContext = createContext<
  BackgroundEffectsContextType | undefined
>(undefined)

export function BackgroundEffectsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize with stored state or defaults - start with effects enabled by default
  const [effectsMode, setEffectsMode] = useState<EffectsMode>("full")
  const [matrixOpacity, setMatrixOpacity] = useState<number>(0.6) // Default to visible
  const [scanLinesEnabled, setScanLinesEnabled] = useState<boolean>(true)
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(true)
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  // Load saved preferences - only run once on client-side initialization
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedMode = localStorage.getItem(
        "effectsMode"
      ) as EffectsMode | null
      const savedOpacity = localStorage.getItem("matrixOpacity")
      const savedScanLines = localStorage.getItem("scanLinesEnabled")
      const savedParticles = localStorage.getItem("particlesEnabled")

      // Apply saved settings if available
      if (savedMode) {
        setEffectsMode(savedMode)
      }

      if (savedOpacity) {
        setMatrixOpacity(parseFloat(savedOpacity))
      }

      if (savedScanLines !== null) {
        setScanLinesEnabled(savedScanLines === "true")
      }

      if (savedParticles !== null) {
        setParticlesEnabled(savedParticles === "true")
      }

      // Handle mobile devices - automatically reduce effects for better performance
      if (!isInitialized) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

        if (isMobile && !savedMode) {
          // Even on mobile, just use "full" or "none" but start with "full"
          setEffectsMode("full")
          setMatrixOpacity(0.5) // Slightly lower opacity for mobile
          setParticlesEnabled(true)
        }

        setIsInitialized(true)
      }
    } catch (error) {
      console.error("Error loading background effects preferences:", error)
      // Continue with defaults if there's an error
    }
  }, [isInitialized])

  // Save preferences whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return

    try {
      localStorage.setItem("effectsMode", effectsMode)
      localStorage.setItem("matrixOpacity", matrixOpacity.toString())
      localStorage.setItem("scanLinesEnabled", scanLinesEnabled.toString())
      localStorage.setItem("particlesEnabled", particlesEnabled.toString())
    } catch (error) {
      console.error("Error saving background effects preferences:", error)
      // Continue even if saving fails
    }
  }, [
    effectsMode,
    matrixOpacity,
    scanLinesEnabled,
    particlesEnabled,
    isInitialized,
  ])

  // Toggle between full and none mode
  const toggleEffectsMode = () => {
    // Simply toggle between the two available modes
    const newMode = effectsMode === "full" ? "none" : "full"

    // Apply the new mode
    setEffectsMode(newMode)

    // Set appropriate opacity based on the new mode
    setMatrixOpacity(newMode === "full" ? 0.6 : 0) // Higher value to make effects more visible

    // Toggle scan lines based on the mode
    setScanLinesEnabled(newMode !== "none")

    // Toggle particles based on the mode
    setParticlesEnabled(newMode === "full")
  }

  return (
    <BackgroundEffectsContext.Provider
      value={{
        effectsMode,
        matrixOpacity,
        scanLinesEnabled,
        particlesEnabled,
        toggleEffectsMode,
        setEffectsMode,
        setMatrixOpacity,
        setScanLinesEnabled,
        setParticlesEnabled,
        isLoadingComplete,
        setIsLoadingComplete,
      }}
    >
      {children}
    </BackgroundEffectsContext.Provider>
  )
}

export function useBackgroundEffects() {
  const context = useContext(BackgroundEffectsContext)

  if (context === undefined) {
    throw new Error(
      "useBackgroundEffects must be used within a BackgroundEffectsProvider"
    )
  }

  return context
}
