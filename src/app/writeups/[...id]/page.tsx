"use client"

import { useState, useEffect, useCallback, useRef, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiCalendar, FiUser, FiTag, FiArrowLeft, FiList } from "react-icons/fi"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Writeup } from "@/lib/writeups"

// Table of Contents interface
interface TOCItem {
  id: string
  text: string
  level: number
}

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

// Table of Contents component - memoized for performance
const TableOfContents = memo(
  ({ items, activeId }: { items: TOCItem[]; activeId: string }) => (
    <div className="cyber-card p-4 sticky top-8 max-h-[80vh] overflow-y-auto table-of-contents">
      <div className="font-orbitron text-custom-pink mb-4 flex items-center gap-2">
        <FiList />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            className="transition-all duration-200"
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 px-2 rounded hover:bg-custom-blue/10 border-l-2 transition-all duration-200 ${
                activeId === item.id
                  ? "border-custom-blue text-custom-blue font-medium"
                  : "border-transparent"
              }`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(item.id)
                if (element) {
                  // Smooth scroll with offset for fixed header
                  const offset = 100
                  const elementPosition = element.getBoundingClientRect().top
                  const offsetPosition =
                    elementPosition + window.pageYOffset - offset

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  })
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
)

TableOfContents.displayName = "TableOfContents"

export default function WriteupPage({ params }: { params: { id: string[] } }) {
  const [writeup, setWriteup] = useState<Writeup | null>(null)
  const [loading, setLoading] = useState(true)
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeHeading, setActiveHeading] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Cache for writeups to avoid refetching
  const CACHE_PREFIX = "writeup-data-"
  const CACHE_EXPIRY = 30 * 60 * 1000 // 30 minutes

  // Use useCallback to prevent recreation of fetch function on each render
  const fetchWriteup = useCallback(async (path: string) => {
    // Show loading state
    setLoading(true)

    // Cache key for this writeup
    const cacheKey = `${CACHE_PREFIX}${path}`

    // Try cache first (client-side only)
    if (typeof window !== "undefined") {
      try {
        const cachedData = sessionStorage.getItem(cacheKey)

        if (cachedData) {
          const parsedData = JSON.parse(cachedData)

          // Check if cache is still valid
          if (
            parsedData.timestamp &&
            Date.now() - parsedData.timestamp < CACHE_EXPIRY
          ) {
            setWriteup(parsedData.writeup)
            setLoading(false)
            return
          }
        }
      } catch (e) {
        console.error("Error reading from cache:", e)
        // Continue with fetch if cache read fails
      }
    }

    try {
      const response = await fetch(`/api/writeups/${path}`, {
        next: { revalidate: 3600 }, // Revalidate once per hour
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch writeup: ${response.status}`)
      }

      const data = await response.json()

      // Cache the result (client-side only)
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              writeup: data,
              timestamp: Date.now(),
            })
          )
        } catch (e) {
          console.error("Error caching writeup data:", e)
          // Continue even if caching fails
        }
      }

      setWriteup(data)
      setError(null)
    } catch (error) {
      console.error("Error fetching writeup:", error)
      setError("Failed to load writeup. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Extract headings after content is loaded
  useEffect(() => {
    if (writeup && contentRef.current) {
      // Give the DOM time to update with the content
      const timer = setTimeout(() => {
        if (!contentRef.current) return

        const headingElements = contentRef.current.querySelectorAll(
          ".prose h2, .prose h3, .prose h4"
        )

        if (headingElements.length === 0) return

        const items: TOCItem[] = []

        headingElements.forEach((element) => {
          const headingEl = element as HTMLElement
          if (!headingEl.id) {
            // Generate an ID if it doesn't exist
            const id =
              headingEl.textContent
                ?.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "") || ""
            headingEl.id = id
          }

          items.push({
            id: headingEl.id,
            text: headingEl.textContent || "",
            level: parseInt(headingEl.tagName.substring(1), 10),
          })
        })

        setTocItems(items)

        // Set initial active heading
        if (items.length > 0) {
          setActiveHeading(items[0].id)
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [writeup])

  // Handle scroll to update active heading - debounced for performance
  useEffect(() => {
    if (tocItems.length === 0) return

    let scrollTimer: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        const headingElements = document.querySelectorAll(
          ".prose h2, .prose h3, .prose h4"
        )

        if (headingElements.length === 0) return

        // Find the heading that's currently in view
        // Add offset to account for navbar
        const scrollPosition = window.scrollY + 120

        // Find the last heading that's above our scroll position
        let currentHeadingId = ""

        for (let i = 0; i < headingElements.length; i++) {
          const element = headingElements[i] as HTMLElement
          const elementPosition = element.offsetTop

          if (elementPosition <= scrollPosition) {
            currentHeadingId = element.id
          } else {
            break
          }
        }

        if (currentHeadingId && currentHeadingId !== activeHeading) {
          setActiveHeading(currentHeadingId)
        } else if (!currentHeadingId && headingElements.length > 0) {
          // Default to first heading if none are in view
          setActiveHeading((headingElements[0] as HTMLElement).id)
        }
      }, 100) // Debounce scroll checks
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Trigger once on initial load
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [tocItems, activeHeading])

  // Fetch writeup when component mounts or params change
  useEffect(() => {
    // Convert params.id to the proper path format
    const path = Array.isArray(params.id) ? params.id.join("/") : params.id
    fetchWriteup(path)
  }, [params, fetchWriteup])

  if (loading) {
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
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-custom-pink text-2xl font-orbitron mb-4"
        >
          {error}
        </motion.div>
        <Link href="/writeups" className="cyber-button-small">
          <FiArrowLeft className="mr-2" /> Back to writeups
        </Link>
      </div>
    )
  }

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
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          {/* Fixed "Back to writeups" button at the top */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="sticky top-4 z-20 mb-4"
          >
            <Link
              href="/writeups"
              className="cyber-button-small inline-flex items-center gap-2 group w-full justify-center"
            >
              <FiArrowLeft className="group-hover:animate-pulse" />
              <span>Back to writeups</span>
            </Link>
          </motion.div>

          {/* Table of Contents */}
          {tocItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="sticky top-20"
            >
              <TableOfContents items={tocItems} activeId={activeHeading} />
            </motion.div>
          )}
        </div>

        <article className="cyber-card relative overflow-hidden flex-grow">
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

            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-4">
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
            ref={contentRef}
            className="prose dark:prose-invert max-w-none relative z-10 writeup-content"
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
      </div>
    </motion.div>
  )
}
