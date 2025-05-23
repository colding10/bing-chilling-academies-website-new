import React, { useState, useEffect, useRef } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
// ...existing imports

export default function BlogPost({ post }) {
  // ...existing code
  const [copySuccess, setCopySuccess] = useState({})
  const headingsRef = useRef([])

  // Function to copy code to clipboard
  const copyToClipboard = (code, id) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopySuccess({ ...copySuccess, [id]: true })
        setTimeout(() => setCopySuccess({ ...copySuccess, [id]: false }), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
      })
  }

  // Scroll and highlight active heading based on scroll position
  useEffect(() => {
    if (!headingsRef.current.length) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120 // Offset for header

      // Find the current active heading
      for (let i = headingsRef.current.length - 1; i >= 0; i--) {
        const heading = headingsRef.current[i]
        if (!heading) continue

        if (heading.offsetTop <= scrollPosition) {
          // Remove active class from all headings
          headingsRef.current.forEach((h) => {
            if (h) h.classList.remove("active-heading", "active")
          })

          // Add active class to current heading
          heading.classList.add("active-heading", "active")
          break
        }
      }
    }

    // Collect all headings
    const headings = document.querySelectorAll(".writeup-heading")
    headingsRef.current = Array.from(headings)

    // Add click handler to headings
    headingsRef.current.forEach((heading) => {
      heading.addEventListener("click", () => {
        window.location.hash = heading.id
      })
    })

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initialize on load

    return () => {
      window.removeEventListener("scroll", handleScroll)
      headingsRef.current.forEach((heading) => {
        if (heading) {
          heading.removeEventListener("click", () => {
            window.location.hash = heading.id
          })
        }
      })
    }
  }, [post])

  // ...existing code
  const renderers = {
    // ...existing renderers
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "")
      const language = match ? match[1] : ""
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`

      if (!inline) {
        return (
          <div className="relative rounded-md overflow-hidden my-4">
            <button
              className={`copy-button ${copySuccess[codeId] ? "copied" : ""}`}
              onClick={() =>
                copyToClipboard(String(children).replace(/\n$/, ""), codeId)
              }
            >
              <FontAwesomeIcon
                icon={copySuccess[codeId] ? faCheck : faCopy}
                className="mr-1"
              />
              {copySuccess[codeId] ? "Copied!" : "Copy"}
            </button>
            <SyntaxHighlighter
              style={tomorrow}
              language={language}
              showLineNumbers={true}
              wrapLines={true}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        )
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    // ...existing renderer code
  }

  // ...existing code

  return (
    // ...existing code
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 gap-8">
        {/* Main content */}
        <div>
          <div className="prose lg:prose-xl max-w-none writeup-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
    // ...existing code
  )
}
