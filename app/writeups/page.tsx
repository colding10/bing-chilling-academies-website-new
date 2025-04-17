"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSearch, FiTag, FiCalendar } from "react-icons/fi";
import CyberCard from "@/components/CyberCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { WriteupMetadata } from "@/lib/writeups";

export default function WriteupsPage() {
  const [writeups, setWriteups] = useState<WriteupMetadata[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold font-orbitron text-center">
          <span className="text-custom-blue h1">CTF</span>{" "}
          <span className="text-custom-pink">Writeups</span>
        </h1>

        <div className="mb-8 space-y-4 py-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input
              type="text"
              placeholder="Search writeups..."
              className="cyber-input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 
                transition-colors duration-300 ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-background"
                    : "border border-primary text-primary hover:border-glow-blue"
                }`}
              >
                <FiTag className="inline" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredWriteups.map((writeup) => (
            <Link key={writeup.id} href={`/writeups/${writeup.id}`}>
              <CyberCard className="hover:scale-[1.01] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="text-2xl text-primary hover:text-secondary 
                    transition-colors duration-300"
                    >
                      {writeup.title}
                    </h2>
                    <p className="text-gray-400 mt-2">{writeup.description}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-2" />
                    {new Date(writeup.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {writeup.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cyber-overlay border border-primary/30 
                      rounded-full text-sm text-primary flex items-center gap-1"
                    >
                      <FiTag className="inline" />
                      {tag}
                    </span>
                  ))}
                </div>
              </CyberCard>
            </Link>
          ))}
        </div>

        {filteredWriteups.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No writeups found matching your criteria.
          </div>
        )}
      </motion.div>
    </div>
  );
}
