"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { FiEye, FiEyeOff, FiMonitor } from "react-icons/fi"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { effectsMode, toggleEffectsMode } = useBackgroundEffects()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  // Determine which icon to show based on effects mode
  const getEffectsIcon = () => {
    switch (effectsMode) {
      case 'full': return <FiEye className="h-5 w-5 text-custom-blue" />;
      case 'reduced': return <FiEye className="h-5 w-5 text-custom-yellow" />;
      case 'minimal': return <FiEyeOff className="h-5 w-5 text-custom-pink" />;
      case 'none': return <FiEyeOff className="h-5 w-5 text-gray-500" />;
    }
  }

  // Get tooltip text based on current mode
  const getEffectsTooltip = () => {
    switch (effectsMode) {
      case 'full': return 'Effects: Full';
      case 'reduced': return 'Effects: Reduced';
      case 'minimal': return 'Effects: Minimal';
      case 'none': return 'Effects: None';
    }
  }

  return (
    <nav className="border-b-2 border-custom-blue/30 bg-custom-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-orbitron text-custom-blue">
            🍦🍦🍦
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              About
            </Link>
            <Link
              href="/achievements"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              Achievements
            </Link>
            <Link
              href="/writeups"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              Writeups
            </Link>
            <div className="flex items-center">
              <button
                onClick={toggleEffectsMode}
                className="p-2 rounded-lg border border-custom-blue/30 hover:border-custom-blue transition-colors cyber-tooltip"
                data-tooltip={getEffectsTooltip()}
              >
                {getEffectsIcon()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
