"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type EffectsMode = "none" | "minimal" | "reduced" | "full"

interface BackgroundEffectsContextType {
  effectsMode: EffectsMode
  matrixOpacity: number
  scanLinesEnabled: boolean
  toggleEffectsMode: () => void
  setEffectsMode: (mode: EffectsMode) => void
  setMatrixOpacity: (opacity: number) => void
  setScanLinesEnabled: (enabled: boolean) => void
  isLoadingComplete: boolean
  setIsLoadingComplete: (complete: boolean) => void
}

const BackgroundEffectsContext = createContext<BackgroundEffectsContextType | undefined>(undefined)

export function BackgroundEffectsProvider({ children }: { children: React.ReactNode }) {
  // Initialize with stored state or defaults
  const [effectsMode, setEffectsMode] = useState<EffectsMode>("reduced")
  const [matrixOpacity, setMatrixOpacity] = useState<number>(0.5)
  const [scanLinesEnabled, setScanLinesEnabled] = useState<boolean>(true)
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false)
  
  // Load saved preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedMode = localStorage.getItem("effectsMode") as EffectsMode | null
    const savedOpacity = localStorage.getItem("matrixOpacity") 
    const savedScanLines = localStorage.getItem("scanLinesEnabled")
    
    if (savedMode) {
      setEffectsMode(savedMode)
    }
    
    if (savedOpacity) {
      setMatrixOpacity(parseFloat(savedOpacity))
    }
    
    if (savedScanLines !== null) {
      setScanLinesEnabled(savedScanLines === "true")
    }
  }, [])
  
  // Save preferences whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem("effectsMode", effectsMode)
    localStorage.setItem("matrixOpacity", matrixOpacity.toString())
    localStorage.setItem("scanLinesEnabled", scanLinesEnabled.toString())
  }, [effectsMode, matrixOpacity, scanLinesEnabled])

  const toggleEffectsMode = () => {
    const modes: EffectsMode[] = ["none", "minimal", "reduced", "full"]
    const currentIndex = modes.indexOf(effectsMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setEffectsMode(modes[nextIndex])
    
    // Set appropriate opacity based on the new mode
    const opacities = [0, 0.3, 0.5, 0.8]
    setMatrixOpacity(opacities[nextIndex])
    
    // Toggle scan lines based on the mode
    setScanLinesEnabled(modes[nextIndex] !== "none")
  }

  return (
    <BackgroundEffectsContext.Provider 
      value={{ 
        effectsMode, 
        matrixOpacity,
        scanLinesEnabled,
        toggleEffectsMode, 
        setEffectsMode,
        setMatrixOpacity,
        setScanLinesEnabled,
        isLoadingComplete,
        setIsLoadingComplete
      }}
    >
      {children}
    </BackgroundEffectsContext.Provider>
  )
}

export function useBackgroundEffects() {
  const context = useContext(BackgroundEffectsContext)
  if (context === undefined) {
    throw new Error("useBackgroundEffects must be used within a BackgroundEffectsProvider")
  }
  return context
}