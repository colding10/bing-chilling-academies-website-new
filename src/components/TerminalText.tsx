"use client"

import { useState, useEffect, useRef } from "react"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"

interface TerminalTextProps {
  text: string
  speed?: number
  className?: string
}

export default function TerminalText({
  text,
  speed = 50,
  className = "",
}: TerminalTextProps) {
  const [displayText, setDisplayText] = useState("")
  const textIndex = useRef(0)
  const isComplete = useRef(false)
  const { isLoadingComplete } = useBackgroundEffects()

  // Reset terminal when text prop changes
  useEffect(() => {
    setDisplayText("")
    textIndex.current = 0
    isComplete.current = false
  }, [text])

  // Type out the text letter by letter
  useEffect(() => {
    // Only start typing if loading is complete
    if (!isLoadingComplete) {
      return;
    }

    if (textIndex.current < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayText(text.substring(0, textIndex.current + 1))
        textIndex.current += 1
        
        // Check if we've completed the text
        if (textIndex.current >= text.length) {
          isComplete.current = true;
        }
      }, speed)

      return () => clearTimeout(timeoutId)
    }
  }, [text, speed, isLoadingComplete, displayText])

  return (
    <div className={`inline-block font-mono text-sm ${className}`}>
      <span className="text-custom-green">&gt;</span>
      <span className="text-custom-yellow font-medium"> {displayText}</span>
      {/* Only show cursor while text is still typing */}
      {isLoadingComplete && !isComplete.current && (
        <span className="text-custom-pink">|</span>
      )}
    </div>
  )
}
