"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  FiTarget,
  FiFlag,
  FiZap,
  FiServer,
  FiExternalLink,
} from "react-icons/fi"
import { memo, useMemo } from "react"

import TerminalText from "@/components/TerminalText"
import HologramCard from "@/components/HologramCard"

interface StatCardProps {
  label: string
  value: string
  color: string
  icon: React.ElementType
  href?: string
}

// Memoize StatCard to prevent unnecessary re-renders
const StatCard = memo(
  ({ label, value, color, icon: Icon, href }: StatCardProps) => {
    const card = (
      <HologramCard className="hover:scale-[1.03] transition-all duration-300 h-full bg-custom-black/70">
        <div className="flex items-center justify-between mb-6">
          <Icon className={`w-10 h-10 ${color}`} />
          <span className={`text-3xl font-orbitron ${color}`}>{value}</span>
        </div>
        <p className="text-gray-400 font-play text-lg">{label}</p>
      </HologramCard>
    )

    if (href) {
      return (
        <Link href={href} className="h-full">
          {card}
        </Link>
      )
    }

    return card
  }
)

StatCard.displayName = "StatCard"

// Pre-calculate animation variants for more efficient animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      type: "spring",
      stiffness: 100,
    },
  },
}

export default function Home() {
  // Use useMemo to prevent recalculating stats on every render
  const stats = useMemo(
    () => [
      {
        label: "Global Ranking",
        value: "#104",
        icon: FiTarget,
        color: "text-custom-blue",
        href: "/achievements",
      },
      {
        label: "USA Ranking",
        value: "#16",
        icon: FiZap,
        color: "text-custom-pink",
        href: "/achievements",
      },
      {
        label: "Flags Captured",
        value: "273",
        icon: FiFlag,
        color: "text-custom-yellow",
        href: "/achievements",
      },
      {
        label: "Team Members",
        value: "6",
        icon: FiServer,
        color: "text-green-500",
        href: "/about",
      },
    ],
    []
  )

  return (
    <div className="relative z-10 min-h-[90vh] flex items-center justify-center flex-col py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-16"
      >
        {/* Title with data corruption effect */}
        <motion.h1
          className="text-6xl font-bold mb-6 relative"
          variants={titleVariants}
        >
          <span className="data-corruption text-custom-blue" data-text="BING">
            BING
          </span>{" "}
          <span
            className="data-corruption text-custom-pink"
            data-text="CHILLING"
          >
            CHILLING
          </span>{" "}
          <span
            className="data-corruption text-custom-yellow"
            data-text="ACADEMIES"
          >
            ACADEMIES
          </span>
        </motion.h1>

        {/* Terminal text effect */}
        <div className="mb-8">
          <TerminalText
            text="a competitive highschool ctf team from the bergen county academies (we like ice cream)"
            speed={70}
          />
        </div>
      </motion.div>

      {/* Clean professional grid layout */}
      <div className="max-w-7xl w-full mx-auto">
        {/* Main stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <StatCard
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                href={stat.href}
              />
            </motion.div>
          ))}
        </div>

        {/* CTFTime profile section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          <HologramCard className="w-full py-8">
            <a
              href="https://ctftime.org/team/283028"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center space-x-6 hover:scale-105 transition-transform"
            >
              <div className="text-custom-blue">
                <svg
                  className="w-20 h-20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6V12L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-orbitron text-custom-pink mb-2">
                  View Our CTFTime Profile
                </h3>
                <p className="text-gray-400 font-play flex items-center text-lg">
                  Check our global ranking and competition history
                  <FiExternalLink className="ml-2 text-custom-blue" />
                </p>
              </div>
            </a>
          </HologramCard>
        </motion.div>
      </div>
    </div>
  )
}
