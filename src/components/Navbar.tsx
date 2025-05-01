"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"
import { motion } from "framer-motion"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { effectsMode, toggleEffectsMode, setMatrixOpacity } = useBackgroundEffects()
  const [isMatrixTooltipVisible, setIsMatrixTooltipVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Handle initial mounting and scroll events
  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 inset-x-0 transition-colors duration-300 z-[60]`}
      style={{
        backgroundColor: scrollY > 0 || isOpen 
          ? 'rgba(8, 8, 16, 0.85)' 
          : 'transparent',
        backdropFilter: scrollY > 0 || isOpen ? 'blur(8px)' : 'none',
        boxShadow: scrollY > 0 || isOpen ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-2xl font-orbitron text-custom-blue">
          🍦🍦🍦
        </Link>

        <div className="hidden md:flex items-center space-x-6">
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
          <div className="relative">
            <button
              onClick={() => {
                toggleEffectsMode()
                if (effectsMode === 'none') {
                  setMatrixOpacity(0.6) // Reduced from 0.8 to match new opacity
                }
              }}
              onMouseEnter={() => setIsMatrixTooltipVisible(true)}
              onMouseLeave={() => setIsMatrixTooltipVisible(false)}
              className="p-2 rounded-full transition-colors bg-background/20 hover:bg-background/30"
              aria-label="Toggle matrix rain effect"
            >
              {effectsMode !== 'none' ? (
                <FiEye className="h-5 w-5 text-custom-blue" />
              ) : (
                <FiEyeOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {isMatrixTooltipVisible && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 top-full z-50 bg-background/90 border border-border rounded-md py-1 px-2 text-xs whitespace-nowrap shadow-lg">
                {effectsMode !== 'none' ? 'Disable Matrix Rain' : 'Enable Matrix Rain'}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
