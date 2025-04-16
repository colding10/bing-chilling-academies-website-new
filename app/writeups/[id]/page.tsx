'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiTag, FiArrowLeft } from 'react-icons/fi'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Writeup } from '@/lib/writeups'

export default function WriteupPage({ params }: { params: { id: string } }) {
  const [writeup, setWriteup] = useState<Writeup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWriteup = async () => {
      try {
        const response = await fetch(`/api/writeups/${params.id}`)
        const data = await response.json()
        setWriteup(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching writeup:', error)
        setLoading(false)
      }
    }

    fetchWriteup()
  }, [params.id])

  if (loading) return <LoadingSpinner />

  if (!writeup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-secondary text-glow-pink">Writeup not found</h1>
        <Link 
          href="/writeups" 
          className="text-primary hover:text-secondary transition-colors duration-300 mt-4 inline-flex items-center gap-2"
        >
          <FiArrowLeft /> Back to writeups
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <Link
        href="/writeups"
        className="text-primary hover:text-secondary transition-colors duration-300 mb-8 inline-flex items-center gap-2"
      >
        <FiArrowLeft /> Back to writeups
      </Link>

      <article className="cyber-card">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary text-glow-blue mb-4">
            {writeup.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FiCalendar />
              {new Date(writeup.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <FiUser />
              {writeup.author}
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
        </div>

        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: writeup.content }}
        />
      </article>
    </motion.div>
  )
}
