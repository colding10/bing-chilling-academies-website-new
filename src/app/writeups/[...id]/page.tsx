"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiCalendar, FiUser, FiTag, FiArrowLeft } from "react-icons/fi"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Writeup } from "@/lib/writeups"

// Removed TOC interface and components

export default function WriteupPage({ params }: { params: { id: string[] } }) {
  const [writeup, setWriteup] = useState<Writeup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Convert path once
  const writeupPath = useMemo(
    () => (Array.isArray(params.id) ? params.id.join("/") : params.id),
    [params.id]
  )

  // Enhance code blocks with syntax highlighting and fix copy functionality
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
          const rawHTML = block.innerHTML.replace(/^\n/, "")
          const lines = rawHTML.split("\n")
          // Remove extra blank first line
          lines.shift();
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

      // Enhance inline code blocks
      const inlineCodeBlocks = contentRef.current.querySelectorAll(
        "p code, li code, td code"
      )
      inlineCodeBlocks.forEach((inlineCode) => {
        // Remove backticks from displayed text
        let codeText = inlineCode.textContent || ""
        if (codeText.startsWith("`") && codeText.endsWith("`")) {
          codeText = codeText.substring(1, codeText.length - 1)
          inlineCode.textContent = codeText
        }

        // Add highlighting class if not already present
        if (!inlineCode.classList.contains("inline-code")) {
          inlineCode.classList.add("inline-code")
        }
      })

      // Add copy buttons to code blocks with properly working clipboard functionality
      const preBlocks = contentRef.current.querySelectorAll("pre")
      preBlocks.forEach((pre) => {
        // First, make sure the pre block has relative positioning
        pre.style.position = "relative"

        // Remove any existing buttons to avoid duplicates
        const existingButtons = pre.querySelectorAll(".copy-button")
        existingButtons.forEach((button) => button.remove())

        // Create and add the button
        const btn = document.createElement("button")
        btn.innerText = "Copy"
        btn.className = "copy-button"

        btn.addEventListener("click", () => {
          const code = pre.querySelector("code")
          if (code) {
            // Strip line numbers when copying
            const codeText = Array.from(code.querySelectorAll(".line"))
              .map((line) => {
                const lineContent = line.textContent || ""
                return lineContent.replace(/^\d+\s+/, "") // Remove line numbers
              })
              .join("\n")

            // Use a textarea for better clipboard support
            const textarea = document.createElement("textarea")
            textarea.value = codeText
            textarea.style.position = "absolute"
            textarea.style.left = "-9999px"
            document.body.appendChild(textarea)
            textarea.select()

            try {
              document.execCommand("copy")
              btn.innerText = "Copied!"
              btn.classList.add("copied")
              setTimeout(() => {
                btn.innerText = "Copy"
                btn.classList.remove("copied")
              }, 2000)
            } catch (err) {
              console.error("Failed to copy", err)
              btn.innerText = "Failed!"
              setTimeout(() => {
                btn.innerText = "Copy"
              }, 2000)
            }

            document.body.removeChild(textarea)
          }
        })

        // Make sure the button is added
        pre.appendChild(btn)
      })
    } catch (e) {
      console.error("Error enhancing code blocks:", e)
    }
  }, [])

  // Fetch writeup data with proper error handling and retries
  useEffect(() => {
    const fetchWriteup = async (retries = 3) => {
      try {
        setLoading(true)

        // Use caching headers to leverage browser cache
        const response = await fetch(`/api/writeups/${writeupPath}`, {
          cache: "force-cache",
          headers: {
            "Cache-Control": "max-age=3600",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch writeup: ${response.status}`)
        }

        const data = await response.json()
        setWriteup(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching writeup:", err)

        // Retry logic with exponential backoff
        if (retries > 0) {
          const delay = 1000 * (3 - retries)
          console.log(`Retrying fetch in ${delay}ms, ${retries} retries left`)
          setTimeout(() => fetchWriteup(retries - 1), delay)
        } else {
          setError("Failed to load writeup. Please try again later.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWriteup()
  }, [writeupPath])

  // Enhance code blocks when content is loaded with debounce
  useEffect(() => {
    if (writeup && contentRef.current) {
      // Debounce to ensure content is fully rendered
      const timerId = setTimeout(() => {
        enhanceCodeBlocks()
      }, 200)

      return () => clearTimeout(timerId)
    }
  }, [writeup, enhanceCodeBlocks])

  // Fix any broken or missing images with proper error handling
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

    // Create the IntersectionObserver for lazy loading if browser supports it
    if ("IntersectionObserver" in window) {
      const lazyImages = contentRef.current.querySelectorAll(
        'img:not([loading="lazy"])'
      )

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement

            // Set loading attribute and original src
            if (image.dataset.src) {
              image.src = image.dataset.src
              delete image.dataset.src
            }

            // Stop observing after loading
            imageObserver.unobserve(image)
          }
        })
      })

      lazyImages.forEach((img) => {
        if (!img.hasAttribute("loading")) {
          img.setAttribute("loading", "lazy")
          imageObserver.observe(img)
        }
      })

      return () => imageObserver.disconnect()
    }
  }, [writeup])

  // Loading state with better animation
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
        <h1 className="text-3xl font-bold text-custom-pink text-glow-pink font-orbitron">
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
      {/* Back button at the top, outside the card */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Link
          href="/writeups"
          className="cyber-button-small inline-flex items-center gap-2 group"
        >
          <FiArrowLeft className="group-hover:animate-pulse" />
          <span>Back to writeups</span>
        </Link>
      </motion.div>

      {/* Article content card */}
      <article className="cyber-card relative overflow-hidden w-full">
        <div className="absolute scanline opacity-20 pointer-events-none"></div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold font-orbitron text-custom-blue text-glow-blue">
              <span className="text-custom-blue">{writeup.ctfName}</span>
            </h1>
          </div>

          <h1 className="text-4xl font-bold font-orbitron text-custom-pink text-glow-pink">
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
