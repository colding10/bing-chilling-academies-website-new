"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FiAlertTriangle } from "react-icons/fi"
import CyberButton from "@/components/CyberButton"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <FiAlertTriangle className="text-red-500 text-5xl mb-6" />
      <h1 className="text-3xl font-bold text-custom-pink mb-4">
        Something went wrong!
      </h1>
      <div className="max-w-md mb-8">
        <p className="text-gray-400 mb-4">
          We&apos;ve encountered an error while trying to display this page.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Error details: {error.message || "Unknown error"}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <CyberButton onClick={reset} className="px-6 py-2">
          Try Again
        </CyberButton>
        <Link href="/" passHref>
          <CyberButton className="px-6 py-2">
            Return Home
          </CyberButton>
        </Link>
      </div>
    </div>
  )
}
