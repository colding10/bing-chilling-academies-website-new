// File: page.tsx (Writeups List)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiTag, FiCalendar, FiFilter, FiX } from "react-icons/fi";
import CyberCard from "@/components/CyberCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { WriteupMetadata } from "@/lib/writeups";

export default function WriteupsPage() {
  const [writeups, setWriteups] = useState<WriteupMetadata[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchWriteups = async () => {
      try {
        const response = await fetch("/api/writeups");
        const data = await response.json();
        setWriteups(data);
        setAllTags(
          Array.from(new Set(data.flatMap((w: WriteupMetadata) => w.tags)))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching writeups:", error);
        setLoading(false);
      }
    };

    fetchWriteups();
  }, []);

  const filteredWriteups = writeups.filter((writeup) => {
    const matchesSearch =
      writeup.title.toLowerCase().includes(search.toLowerCase()) ||
      writeup.description.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => writeup.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

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
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with hologram effect */}
        <div className="text-center mb-12 relative">
          <div className="hologram-lines absolute inset-0 rounded-lg opacity-30"></div>
          <motion.h1
            className="text-5xl font-bold font-orbitron relative z-10 py-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span
              className="text-custom-blue text-glow-blue data-corruption"
              data-text="CTF"
            >
              CTF
            </span>{" "}
            <span
              className="text-custom-pink text-glow-pink data-corruption"
              data-text="Writeups"
            >
              Writeups
            </span>
          </motion.h1>
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
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
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
                <Link href={`/writeups/${writeup.id}`}>
                  <CyberCard className="hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute scanline opacity-10 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <h2
                          className="text-2xl font-orbitron text-custom-blue group-hover:text-glow-blue 
                          transition-colors duration-300"
                        >
                          {writeup.title}
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
  );
}
