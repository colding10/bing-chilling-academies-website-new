"use client";

import { useState, useEffect } from "react";

interface TerminalTextProps {
  text: string;
  speed?: number;
}

export default function TerminalText({ text, speed = 50 }: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className="font-share-tech">
      <span className="text-custom-blue">&gt; </span>
      <span>{displayedText}</span>
      <span className="animate-pulse">_</span>
    </div>
  );
}
