"use client"

import { useState, useEffect, useRef, memo } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

interface TerminalTextProps {
  text: string
  speed?: number
  className?: string
  cursorBlink?: boolean
  textColor?: string
  promptColor?: string
}

export default memo(function TerminalText({
  text,
  speed = 50,
  className = "",
  cursorBlink = true,
  textColor = "text-white",
  promptColor = "text-custom-blue",
}: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { isLoadingComplete } = useBackgroundEffects()

  // Reset when text prop changes
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  // Handle typing animation
  useEffect(() => {
    // Don't start typing until loading is complete
    if (!isLoadingComplete) return

    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed, isLoadingComplete, isComplete])

  return (
    <div className={`font-share-tech ${className}`}>
      <span className={promptColor}>&gt; </span>
      <span className={textColor}>{displayedText}</span>
      {cursorBlink && (
        <span
          className={`${isComplete ? "animate-pulse" : "opacity-0"} transition-opacity duration-300`}
        >
          _
        </span>
      )}
    </div>
  )
})
