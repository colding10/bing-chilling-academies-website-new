"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FiHome, FiAlertTriangle, FiRefreshCw } from "react-icons/fi"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full text-center"
      >
        <div
          className="text-custom-pink mb-8 font-orbitron text-6xl font-bold"
          style={{ textShadow: "0 0 10px rgba(255, 0, 143, 0.5)" }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <FiAlertTriangle size={80} />
          </motion.div>
          <div className="data-corruption" data-text="System Error">
            System Error
          </div>
        </div>

        <div className="cyber-card p-8 bg-cyber-overlay relative overflow-hidden">
          <div className="absolute scanline opacity-20 pointer-events-none"></div>

          <h2 className="text-custom-blue text-xl mb-6 font-mono">
            &gt; Error detected in the mainframe
          </h2>

          <div className="text-gray-400 mb-8 font-share-tech">
            <p>
              An unexpected error has occurred. The security system has been
              notified.
            </p>
            <div className="mt-4 p-4 bg-cyber-overlay/50 border border-custom-blue/30 rounded-md text-left overflow-x-auto">
              <code className="text-sm text-custom-yellow">
                {error?.message || "Unknown error occurred"} <br />
                {error?.digest && <span>Reference: {error.digest}</span>}
              </code>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="cyber-button flex items-center justify-center gap-2"
            >
              <FiRefreshCw /> Try Again
            </button>
            <Link
              href="/"
              className="cyber-button flex items-center justify-center gap-2"
            >
              <FiHome /> Return Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
