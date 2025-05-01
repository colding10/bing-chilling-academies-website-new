"use client"

import { useState, useEffect, useCallback, useRef, memo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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
  ({
    items,
    activeId,
    onHeadingClick,
  }: {
    items: TOCItem[]
    activeId: string
    onHeadingClick: (id: string) => void
  }) => (
    <div className="cyber-card p-4 sticky top-8 max-h-[80vh] overflow-y-auto table-of-contents">
      <div className="font-orbitron text-custom-pink mb-4 flex items-center gap-2">
        <FiList />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
            className="transition-all duration-200"
          >
            <button
              className={`block py-1 px-2 rounded hover:bg-custom-blue/10 border-l-2 transition-all duration-200 w-full text-left ${
                activeId === item.id
                  ? "border-custom-blue text-custom-blue font-medium"
                  : "border-transparent"
              }`}
              onClick={() => {
                // Simple approach: use the native browser scrollIntoView with options
                const element = document.getElementById(item.id)
                if (element) {
                  // Prevent default anchor link behavior
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })

                  // Apply offset by scrolling back up a bit (accounting for fixed header)
                  setTimeout(() => {
                    window.scrollBy({
                      top: -120, // Header offset
                      behavior: "smooth",
                    })

                    // Update URL hash without jumping (using history API)
                    history.pushState(null, "", `#${item.id}`)

                    // Update active heading state
                    onHeadingClick(item.id)

                    // Log for debugging
                    console.log(`Scrolled to ${item.id}`)
                  }, 100)
                }
              }}
            >
              {item.text}
            </button>
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
  const [error, setError] = useState<string | null>(null)
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeHeading, setActiveHeading] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  // Function to generate Table of Contents from content
  const generateTOC = useCallback(() => {
    if (!contentRef.current) return

    try {
      // Find all heading elements in the content
      const headingElements = contentRef.current.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      )

      if (headingElements.length === 0) return

      const items: TOCItem[] = []

      headingElements.forEach((element, index) => {
        const headingEl = element as HTMLElement

        // Ensure each heading has a unique ID
        if (!headingEl.id) {
          // Generate an ID based on heading text or index position
          let id = ""
          if (headingEl.textContent?.trim()) {
            id = headingEl.textContent
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")
          }

          // If no text or empty after sanitization, use index-based ID
          if (!id) {
            id = `heading-${index}`
          }

          // Ensure ID uniqueness
          if (document.getElementById(id)) {
            id = `${id}-${index}`
          }

          headingEl.id = id
        }

        // Only add if we have a valid ID
        if (headingEl.id) {
          items.push({
            id: headingEl.id,
            text: headingEl.textContent?.trim() || `Heading ${index + 1}`,
            level: parseInt(headingEl.tagName.substring(1), 10),
          })
        }
      })

      setTocItems(items)

      // Set initial active heading
      if (items.length > 0) {
        setActiveHeading(items[0].id)
      }
    } catch (e) {
      console.error("Error generating table of contents:", e)
    }
  }, [])

  // Enhance code blocks with syntax highlighting class if not already applied
  const enhanceCodeBlocks = useCallback(() => {
    if (!contentRef.current) return

    try {
      // Find all code blocks that don't have proper syntax highlighting
      const codeBlocks = contentRef.current.querySelectorAll(
        "pre > code:not(.language-*)"
      )

      codeBlocks.forEach((codeBlock) => {
        if (!codeBlock.className.includes("language-")) {
          // Add a default language class for proper styling
          codeBlock.classList.add("language-plaintext")
        }
      })

      // Make sure all code blocks have line numbers
      const allCodeBlocks = contentRef.current.querySelectorAll("pre > code")
      allCodeBlocks.forEach((block) => {
        if (!block.innerHTML.includes("line-number-style")) {
          const lines = block.innerHTML.split("\n")
          let lineNumberedHTML = ""

          lines.forEach((line, index) => {
            if (line.trim()) {
              lineNumberedHTML += `<span class="line"><span class="line-number-style">${index + 1}</span>${line}</span>\n`
            } else {
              lineNumberedHTML += `<span class="line"><span class="line-number-style">${index + 1}</span></span>\n`
            }
          })

          block.innerHTML = lineNumberedHTML
        }
      })
    } catch (e) {
      console.error("Error enhancing code blocks:", e)
    }
  }, [])

  // Initialize and enhance headings when the content is loaded
  const enhanceHeadings = useCallback(() => {
    if (!contentRef.current) return

    try {
      // This function ensures all headings have proper IDs and click handling
      const headingElements = contentRef.current.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      )

      headingElements.forEach((element, index) => {
        const headingEl = element as HTMLElement

        // Ensure each heading has a unique ID
        if (!headingEl.id) {
          // Generate an ID based on heading text or index position
          let id = ""
          if (headingEl.textContent?.trim()) {
            id = headingEl.textContent
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")
          }

          // If no text or empty after sanitization, use index-based ID
          if (!id) {
            id = `heading-${index}`
          }

          // Ensure ID uniqueness
          if (document.getElementById(id)) {
            id = `${id}-${index}`
          }

          headingEl.id = id
        }

        // Add a class to help with styling and selection
        headingEl.classList.add("writeup-heading")

        // Add click handling for easy copy link
        headingEl.addEventListener("click", (e) => {
          if (headingEl.id) {
            // Update URL hash when heading is clicked
            history.pushState(null, "", `#${headingEl.id}`)

            // Show "link copied" feedback (optional)
            const wasAlreadyActive =
              headingEl.classList.contains("active-heading")

            if (!wasAlreadyActive) {
              headingEl.classList.add("active-heading")
              setTimeout(() => {
                headingEl.classList.remove("active-heading")
              }, 500)
            }
          }
        })
      })
    } catch (e) {
      console.error("Error enhancing headings:", e)
    }
  }, [])

  // Fetch writeup data
  useEffect(() => {
    const fetchWriteup = async () => {
      try {
        setLoading(true)
        const path = Array.isArray(params.id) ? params.id.join("/") : params.id
        const response = await fetch(`/api/writeups/${path}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch writeup: ${response.status}`)
        }

        const data = await response.json()
        setWriteup(data)
      } catch (err) {
        console.error("Error fetching writeup:", err)
        setError("Failed to load writeup. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchWriteup()
  }, [params.id])

  // Generate table of contents when content is loaded
  useEffect(() => {
    if (writeup && contentRef.current) {
      // Wait for the content to be fully rendered
      setTimeout(() => {
        generateTOC()
        enhanceCodeBlocks()
        enhanceHeadings()
      }, 200)
    }
  }, [writeup, generateTOC, enhanceCodeBlocks, enhanceHeadings])

  // Update active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || tocItems.length === 0) return

      // Find all heading elements that have IDs matching our TOC items
      const headingsWithPositions = tocItems.map((item) => {
        const element = document.getElementById(item.id)
        if (!element) return { id: item.id, top: 0, element: null }

        // Get position relative to the viewport
        const rect = element.getBoundingClientRect()
        return {
          id: item.id,
          top: rect.top,
          element,
          level: item.level, // Include heading level for better sorting
        }
      })

      // Calculate header offset - use a smaller offset for lower level headings
      const baseHeaderOffset = 150

      // Filter headings that are above or close to the top of the viewport
      const visibleHeadings = headingsWithPositions
        .filter((h) => h.element && h.top <= baseHeaderOffset)
        // Sort by position (closest to the top but still visible gets priority)
        .sort((a, b) => b.top - a.top)

      // If we have visible headings, use the first one
      if (visibleHeadings.length > 0) {
        // If there are multiple visible headings at similar positions, prefer the higher level heading
        setActiveHeading(visibleHeadings[0].id)

        // Log the active heading for debugging
        console.log("Active heading:", visibleHeadings[0].id)
      } else if (headingsWithPositions.length > 0) {
        // If no headings are visible, find the one closest to becoming visible
        const sortedByProximity = [...headingsWithPositions]
          .filter((h) => h.element)
          .sort((a, b) => a.top - b.top)

        if (sortedByProximity.length > 0) {
          setActiveHeading(sortedByProximity[0].id)
        }
      }
    }

    // Run once on mount and whenever TOC items change
    handleScroll()

    // Add throttled scroll handler for better performance
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Add event listeners with proper cleanup
    window.addEventListener("scroll", scrollListener, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    window.addEventListener("hashchange", handleScroll, { passive: true })

    // Check if there's a hash in the URL on load and scroll to it
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          const headerOffset = 120
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: "smooth",
          })
          setActiveHeading(id)
        }, 300)
      }
    }

    return () => {
      window.removeEventListener("scroll", scrollListener)
      window.removeEventListener("resize", handleScroll)
      window.removeEventListener("hashchange", handleScroll)
    }
  }, [tocItems])

  // Fix any broken or missing images
  useEffect(() => {
    if (!contentRef.current) return

    const images = contentRef.current.querySelectorAll("img")
    images.forEach((img) => {
      img.onerror = () => {
        // Add a css class to show a placeholder for broken images
        img.classList.add("broken-image")
        img.setAttribute("alt", "Image not found")
      }
    })
  }, [writeup])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-8">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pt-10 text-center">
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
        className="max-w-4xl mx-auto px-4 py-8 pt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-3xl font-bold text-custom-pink text-glow-pink font-orbitron data-corruption"
          data-text="Writeup Not Found"
        >
          Writeup Not Found
        </h1>
        <p className="text-gray-400 mt-4 mb-6">
          The writeup you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link href="/writeups" className="cyber-button-small">
          <FiArrowLeft className="mr-2" /> Back to writeups
        </Link>
      </motion.div>
    )
  }

  // Check if the content seems to be unprocessed markdown
  const contentMightBeRaw =
    writeup.content &&
    (writeup.content.includes("```") ||
      writeup.content.includes("##") ||
      !writeup.content.includes("<"))

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
              <TableOfContents
                items={tocItems}
                activeId={activeHeading}
                onHeadingClick={setActiveHeading}
              />
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
            </div>

            <h1
              className="text-4xl font-bold font-orbitron text-custom-pink text-glow-pink data-corruption"
              data-text={writeup.title}
            >
              <span className="text-custom-pink">{writeup.title}</span>
            </h1>

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

          {/* Show a warning if content might be unprocessed */}
          {contentMightBeRaw && (
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded p-4 mb-6 text-yellow-200">
              <p>
                Note: This content may not be displaying properly. The team has
                been notified.
              </p>
            </div>
          )}

          <motion.div
            ref={contentRef}
            className="prose dark:prose-invert max-w-none relative z-10 writeup-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            dangerouslySetInnerHTML={{ __html: writeup.content }}
          />

          <p className="text-sm text-gray-400 mb-4">
            If you can&apos;t see the writeup, it&apos;s likely because it
            hasn&apos;t been published yet.
          </p>

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
