"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FiHome, FiSearch } from "react-icons/fi"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[12rem] font-orbitron leading-none font-bold relative"
          >
            <span className="text-custom-blue text-glow-blue absolute left-1/2 -translate-x-1/2 opacity-30 blur-[5px]">
              404
            </span>
            <span
              className="relative text-custom-blue text-glow-blue data-corruption"
              data-text="404"
            >
              404
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-2xl font-orbitron text-custom-pink mb-4 data-corruption"
            data-text="Signal Lost"
          >
            Signal Lost
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="cyber-card p-8 bg-cyber-overlay relative overflow-hidden"
        >
          <div className="absolute scanline opacity-20 pointer-events-none"></div>

          <h2 className="text-custom-blue text-xl mb-6 font-mono">
            &gt; Page not found in the mainframe
          </h2>

          <div className="text-gray-400 mb-8 font-share-tech">
            <p>
              The requested resource could not be located on this server. The
              data may have been moved, deleted, or never existed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/writeups"
              className="cyber-button-small flex items-center justify-center gap-2"
            >
              <FiSearch /> Browse Writeups
            </Link>
            <Link
              href="/"
              className="cyber-button flex items-center justify-center gap-2"
            >
              <FiHome /> Return Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
