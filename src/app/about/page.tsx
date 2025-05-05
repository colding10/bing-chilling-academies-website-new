"use client"

import { motion } from "framer-motion"
import {
  FiCode,
  FiShield,
  FiCpu,
  FiLock,
  FiSearch,
  FiDatabase,
} from "react-icons/fi"
import TerminalText from "@/components/TerminalText"

interface TeamMember {
  handle: string
  specialties: string[]
  bio: string
}

// Map specialties to icons
const specialtyIcons = {
  web: FiCode,
  crypto: FiLock,
  pwn: FiShield,
  misc: FiDatabase,
  rev: FiCpu,
  forensics: FiDatabase,
  OSINT: FiSearch,
}

const teamMembers: TeamMember[] = [
  {
    handle: "appllo",
    specialties: ["web", "crypto", "OSINT"],
    bio: "orz at web and crypto, but is js here for the japanese osint",
  },
  {
    handle: "bo421",
    specialties: ["pwn", "forensics", "OSINT"],
    bio: "they say he's our only pwner, and he is. bro's soloing pwn",
  },
  {
    handle: "cold",
    specialties: ["rev", "forensics", "pwn"],
    bio: "professional rev gooner. loves to goon to ida and gdb",
  },
  {
    handle: "Snippet",
    specialties: ["crypto", "forensics"],
    bio: "crypto goat and foren god. only those who know him know",
  },
  {
    handle: "tien",
    specialties: ["OSINT", "misc", "forensics"],
    bio: "chatgpt goat. global t5 osint and mains every category",
  },
  {
    handle: "UncleEddie",
    specialties: ["OSINT", "misc"],
    bio: "one of a kind vibe ctfer? pro stalker/osinter ig",
  },
]

const MemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative cyber-card overflow-hidden group"
    >
      {/* Member handle with glitch effect */}
      <div className="mb-4">
        <h3
          className="text-xl font-orbitron font-bold text-custom-pink data-corruption"
          data-text={member.handle}
        >
          {member.handle}
        </h3>
      </div>

      {/* Specialties with icons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {member.specialties.map((specialty) => {
          const Icon =
            specialtyIcons[specialty as keyof typeof specialtyIcons] ||
            FiDatabase
          return (
            <span
              key={specialty}
              className="px-3 py-1 bg-custom-blue/10 border border-custom-blue/30 
                rounded-full text-sm text-custom-blue flex items-center gap-1"
            >
              <Icon className="w-3 h-3" />
              {specialty}
            </span>
          )
        })}
      </div>

      {/* Bio with terminal text effect */}
      <div className="text-gray-300 text-sm font-share-tech bg-black/20 p-3 rounded">
        <TerminalText text={member.bio} speed={30} />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-custom-blue via-custom-pink to-custom-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  )
}

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* Section header */}
        <div className="text-center mb-12 relative">
          <motion.h1
            className="text-5xl font-bold font-orbitron relative z-10 py-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="text-custom-blue text-glow-blue">Meet</span>{" "}
            <span className="text-custom-pink text-glow-pink">The</span>{" "}
            <span className="text-custom-yellow text-glow-yellow">Team</span>
          </motion.h1>

          <p className="text-gray-400 font-play max-w-xl mx-auto mt-4 relative z-10">
            a group of high schoolers from the Bing Chilling Academies who like
            ice cream.
          </p>
        </div>

        {/* Team grid with terminal-like cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <MemberCard key={member.handle} member={member} />
          ))}
        </div>

        {/* Team stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-custom-black/30 border border-custom-blue/20 rounded-lg p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-custom-blue text-4xl font-orbitron">6</p>
              <p className="text-gray-400 font-play">Members</p>
            </div>
            <div>
              <p className="text-custom-pink text-4xl font-orbitron">7</p>
              <p className="text-gray-400 font-play">Specialties</p>
            </div>
            <div>
              <p className="text-custom-yellow text-4xl font-orbitron">19</p>
              <p className="text-gray-400 font-play">CTFs</p>
            </div>
            <div>
              <p className="text-green-500 text-4xl font-orbitron">#172</p>
              <p className="text-gray-400 font-play">Global Ranking</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
