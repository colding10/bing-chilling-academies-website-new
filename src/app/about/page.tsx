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
import Image from "next/image"
import TerminalText from "@/components/TerminalText"

interface TeamMember {
  handle: string
  specialties: string[]
  bio: string
  avatarUrl?: string
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
    avatarUrl: "/images/team/appllo.png",
    specialties: ["web", "crypto", "OSINT"],
    bio: "cracked at web and crypto. this guy might be 200% japanese",
  },
  {
    handle: "bo421",
    avatarUrl: "/images/team/bo.png",
    specialties: ["pwn", "forensics", "OSINT"],
    bio: "plays pwn and osint. i am relatively sure that he has hair",
  },
  {
    handle: "cold",
    avatarUrl: "/images/team/cold.jpg",
    specialties: ["rev", "forensics", "pwn"],
    bio: "professional rev(al) gooner. at least he is under 400 years old",
  },
  {
    handle: "SnippetCat",
    avatarUrl: "/images/team/snippetcat.png",
    specialties: ["crypto", "forensics"],
    bio: "crypto goat and foren god. pretty sure he is a person as well",
  },
  {
    handle: "tien",
    avatarUrl: "/images/team/tien.png",
    specialties: ["OSINT", "misc", "forensics"],
    bio: "\"t5 osint global\" - the huzz. at least isn't AI or a furry",
  },
  {
    handle: "堇姬Naup",
    avatarUrl: "/images/team/naup.png",
    specialties: ["pwn", "web", "crypto"],
    bio: "god of pwn. check him out https://naupjjin.github.io/.",
  },
]

const MemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cyber-card flex flex-col items-center p-6 space-y-4 text-center"
    >
      {/* Profile picture */}
      {member.avatarUrl && (
        <Image
          src={member.avatarUrl}
          alt={member.handle}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
      )}

      {/* Member handle */}
      <h3 className="text-xl font-orbitron font-bold text-custom-pink">
        {member.handle}
      </h3>

      {/* Specialties with icons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {member.specialties.map((specialty) => {
          const Icon =
            specialtyIcons[specialty as keyof typeof specialtyIcons] ||
            FiDatabase
          return (
            <span
              key={specialty}
              className="px-3 py-1 bg-custom-blue/10 border border-custom-blue/30 rounded-full text-sm text-custom-blue flex items-center gap-1"
            >
              <Icon className="w-4 h-4" />
              {specialty}
            </span>
          )
        })}
      </div>

      {/* Bio */}
      <div className="text-gray-300 text-sm font-share-tech bg-black/20 p-4 rounded-lg max-w-xs">
        <TerminalText text={member.bio} speed={30} />
      </div>
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
          className="bg-custom-black/80 border-2 border-custom-blue/30 rounded-lg p-6 backdrop-blur-sm shadow-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-custom-blue text-4xl font-orbitron font-bold text-glow-blue">
                6
              </p>
              <p className="text-white font-play">Members</p>
            </div>
            <div>
              <p className="text-custom-pink text-4xl font-orbitron font-bold text-glow-pink">
                7
              </p>
              <p className="text-white font-play">Specialties</p>
            </div>
            <div>
              <p className="text-custom-yellow text-4xl font-orbitron font-bold text-glow-yellow">
                24
              </p>
              <p className="text-white font-play">CTFs</p>
            </div>
            <div>
              <p className="text-green-500 text-4xl font-orbitron font-bold">
                <span className="text-glow-hover">#105</span>
              </p>
              <p className="text-white font-play">Global Ranking</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
