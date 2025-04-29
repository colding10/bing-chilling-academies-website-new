// File: page.tsx (Writeup Detail)
"use client"

import { useState, useEffect, useCallback, memo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiCalendar, FiUser, FiTag, FiArrowLeft } from "react-icons/fi"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Writeup } from "@/lib/writeups"
import { use } from "react"

// Memoize tag components for better performance
const WriteupTag = memo(({ tag, index }: { tag: string; index: number }) => (
  <motion.span
    key={tag}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + index * 0.1 }}
    className="px-3 py-1 bg-cyber-overlay border border-custom-blue/30
    rounded-full text-sm text-custom-blue flex items-center gap-1 hover:border-custom-blue hover:text-glow-blue transition-all duration-300"
  >
    <FiTag className="inline" />
    {tag}
  </motion.span>
))

WriteupTag.displayName = "WriteupTag"

export default function WriteupPage({
  params,
}: {
  params: Promise<{ id: string[] }>
}) {
  const [writeup, setWriteup] = useState<Writeup | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  // Use a memo cache for writeups to avoid refetching
  const CACHE_PREFIX = "writeup-data-"

  // Use useCallback to prevent recreation of fetch function on each render
  const fetchWriteup = useCallback(async (path: string) => {
    // Check cache first
    const cacheKey = `${CACHE_PREFIX}${path}`
    const cachedData = sessionStorage.getItem(cacheKey)

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData)
        setWriteup(parsedData)
        setLoading(false)
        return
      } catch (e) {
        // Cache parsing failed, proceed with fetch
        console.error("Error parsing cached writeup:", e)
      }
    }

    try {
      const response = await fetch(`/api/writeups/${path}`)
      const data = await response.json()

      // Cache the result
      sessionStorage.setItem(cacheKey, JSON.stringify(data))

      setWriteup(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching writeup:", error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Convert resolvedParams.id to the proper path format
    const path = Array.isArray(resolvedParams.id)
      ? resolvedParams.id.join("/")
      : resolvedParams.id

    fetchWriteup(path)
  }, [resolvedParams, fetchWriteup])

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
        <motion.div
          className="ml-4 text-custom-blue font-orbitron"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Decrypting writeup data...
        </motion.div>
      </div>
    )

  if (!writeup) {
    return (
      <motion.div
        className="max-w-4xl mx-auto px-4 py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-3xl font-bold text-custom-pink text-glow-pink font-orbitron data-corruption"
          data-text="Writeup not found"
        >
          Writeup not found
        </h1>
        <div className="mt-6 relative">
          <div className="hologram-lines absolute inset-0 rounded-lg opacity-30"></div>
          <Link
            href="/writeups"
            className="cyber-button inline-flex items-center gap-2 relative z-10"
          >
            <FiArrowLeft className="animate-pulse" /> Back to writeups
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/writeups"
          className="cyber-button-small inline-flex items-center gap-2 mb-8 group"
        >
          <FiArrowLeft className="group-hover:animate-pulse" />
          <span>Back to writeups</span>
        </Link>
      </motion.div>

      <article className="cyber-card relative overflow-hidden">
        <div className="absolute scanline opacity-20 pointer-events-none"></div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <h1
              className="text-4xl font-bold font-orbitron text-custom-blue text-glow-blue data-corruption"
              data-text={writeup.ctfName}
            >
              <span className="text-custom-blue">{writeup.ctfName}</span>
            </h1>
            <h1
              className="text-4xl font-bold font-orbitron text-custom-pink text-glow-pink data-corruption"
              data-text={writeup.title}
            >
              <span className="text-custom-pink">{writeup.title}</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-custom-yellow" />
              {new Date(writeup.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <FiUser className="text-custom-pink" />
              <span className="font-share-tech">{writeup.author}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {writeup.tags.map((tag, index) => (
              <WriteupTag key={tag} tag={tag} index={index} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="prose dark:prose-invert max-w-none relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          dangerouslySetInnerHTML={{ __html: writeup.content }}
        />

        {/* Bottom highlight effect */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-custom-blue via-custom-pink to-custom-yellow"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </article>
    </motion.div>
  )
}
