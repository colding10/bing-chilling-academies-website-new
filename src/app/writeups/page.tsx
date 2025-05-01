// File: page.tsx (Writeups List)
"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiTag, FiCalendar, FiFilter, FiX } from "react-icons/fi"
import CyberCard from "@/components/CyberCard"
import LoadingSpinner from "@/components/LoadingSpinner"
import { WriteupMetadata } from "@/lib/writeups"

// Memoize the CyberCard wrapper for writeup items
const WriteupCard = memo(
  ({
    writeup,
    selectedTags,
  }: {
    writeup: WriteupMetadata
    selectedTags: string[]
  }) => (
    <Link href={`/writeups/${writeup.id}`}>
      <CyberCard className="hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden">
        <div className="absolute scanline opacity-10 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h2 className="text-2xl font-orbitron transition-colors duration-300">
              <span className="text-custom-blue group-hover:text-glow-blue">
                {writeup.ctfName}
              </span>{" "}
              <span className="text-custom-pink group-hover:text-glow-purple">
                {writeup.title}
              </span>
            </h2>
            <p className="text-gray-400 mt-2 font-share-tech">
              {writeup.description}
            </p>
          </div>
          <div className="flex items-center text-sm text-gray-400 whitespace-nowrap">
            <FiCalendar className="mr-2 text-custom-yellow" />
            {new Date(writeup.date).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {writeup.tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 bg-cyber-overlay border rounded-full 
              text-sm flex items-center gap-1 transition-colors duration-300
              ${
                selectedTags.includes(tag)
                  ? "border-custom-blue text-custom-blue"
                  : "border-primary/30 text-primary"
              }`}
            >
              <FiTag className="inline" />
              {tag}
            </span>
          ))}
        </div>

        {/* Animated bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-custom-blue via-custom-pink to-custom-yellow"
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4 }}
        />
      </CyberCard>
    </Link>
  )
)

WriteupCard.displayName = "WriteupCard"

export default function WriteupsPage() {
  const [writeups, setWriteups] = useState<WriteupMetadata[]>([])
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  // Use a cache key to avoid refetching when the component remounts
  const CACHE_KEY = "writeups-data"

  useEffect(() => {
    const fetchWriteups = async () => {
      // Try to get from sessionStorage first
      const cachedData = sessionStorage.getItem(CACHE_KEY)

      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        setWriteups(parsedData.writeups)
        setAllTags(parsedData.tags)
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/writeups")
        const data = await response.json()

        // Extract all unique tags in one pass
        const uniqueTags = new Set<string>()
        data.forEach((w: WriteupMetadata) => {
          w.tags.forEach((tag) => uniqueTags.add(tag))
        })

        const tags = Array.from(uniqueTags)

        // Cache the data
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            writeups: data,
            tags: tags,
            timestamp: Date.now(),
          })
        )

        setWriteups(data)
        setAllTags(tags)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching writeups:", error)
        setLoading(false)
      }
    }

    fetchWriteups()
  }, [])

  // Memoize filtered writeups to avoid unnecessary recalculations
  const filteredWriteups = useMemo(() => {
    return writeups.filter((writeup) => {
      const matchesSearch =
        writeup.title.toLowerCase().includes(search.toLowerCase()) ||
        writeup.ctfName.toLowerCase().includes(search.toLowerCase()) ||
        writeup.description.toLowerCase().includes(search.toLowerCase())
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => writeup.tags.includes(tag))
      return matchesSearch && matchesTags
    })
  }, [writeups, search, selectedTags])

  // Use callback for tag toggle handler to prevent recreating on every render
  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner />
        <motion.div
          className="mt-6 text-xl text-custom-blue font-orbitron"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading CTF writeups...
        </motion.div>
      </div>
    )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Section header */}
        <div className="text-center mb-12 relative">
          <motion.h1
            className="text-5xl font-bold font-orbitron relative z-10 py-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="text-custom-blue text-glow-blue">Capture</span>{" "}
            <span className="text-custom-pink text-glow-pink">The</span>{" "}
            <span className="text-custom-yellow text-glow-yellow">
              Writeups
            </span>
          </motion.h1>

          <p className="text-gray-400 font-play max-w-xl mx-auto mt-4 relative z-10">
            Our detailed solutions to CTF challenges across various categories.
          </p>
        </div>

        <div className="mb-8 space-y-6">
          {/* Search and filter bar */}
          <motion.div
            className="relative cyber-card-input flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-blue animate-pulse" />
              <input
                type="text"
                placeholder="Search writeups..."
                className="cyber-input pl-10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`cyber-button-small flex items-center gap-2 ${
                selectedTags.length > 0 ? "cyber-button-active" : ""
              }`}
            >
              {filterOpen ? <FiX /> : <FiFilter />}
              <span>Filters</span>
              {selectedTags.length > 0 && (
                <span className="bg-custom-pink text-background rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </motion.div>

          {/* Tag filters */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap gap-3 py-2">
                  {allTags.map((tag, index) => (
                    <motion.button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 
                      transition-all duration-300 ${
                        selectedTags.includes(tag)
                          ? "bg-custom-blue text-background"
                          : "border border-custom-blue/30 text-custom-blue hover:border-custom-blue hover:text-glow-blue"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <FiTag className="inline" />
                      {tag}
                    </motion.button>
                  ))}
                </div>

                {selectedTags.length > 0 && (
                  <motion.div
                    className="flex justify-end mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-custom-pink text-sm flex items-center gap-1 hover:text-glow-pink"
                    >
                      <FiX /> Clear filters
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredWriteups.map((writeup, index) => (
              <motion.div
                key={writeup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <WriteupCard writeup={writeup} selectedTags={selectedTags} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredWriteups.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className="font-orbitron text-2xl text-custom-pink mb-4 data-corruption"
              data-text="No results found"
            >
              No results found
            </div>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
