"use client"

import { useState, useEffect, useRef, memo } from "react"

interface TerminalTextProps {
  text: string
  speed?: number
}

export default memo(function TerminalText({
  text,
  speed = 50,
}: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("")
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let i = 0

    // Use a more efficient recursive approach instead of creating a new timeout for each character
    const typeNextChar = () => {
      if (i < text.length) {
        // Ensure we're getting a character from the text string and handle spaces correctly
        const nextChar = text.charAt(i);
        setDisplayedText((prev) => prev + nextChar);
        i++
        timeoutRef.current = setTimeout(typeNextChar, speed)
      } else {
        setIsComplete(true)
      }
    }

    // Start typing
    timeoutRef.current = setTimeout(typeNextChar, speed)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed])

  return (
    <div className="font-share-tech">
      <span className="text-custom-blue">&gt; </span>
      <span>{displayedText}</span>
      {!isComplete && <span className="animate-pulse">_</span>}
    </div>
  )
})
