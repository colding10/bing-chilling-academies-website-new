"use client"

import { motion } from "framer-motion"
import {
  FiTarget,
  FiFlag,
  FiAward,
  FiTrendingUp,
  FiExternalLink,
  FiSearch,
} from "react-icons/fi"
import { useState, useMemo } from "react"

interface StatCardProps {
  label: string
  value: string
  color: string
  icon: React.ElementType
}

const StatCard = ({ label, value, color, icon: Icon }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-custom-black/30 border border-custom-blue/20 rounded-lg p-6 hover:border-custom-blue/60 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className={`w-8 h-8 ${color}`} />
      <span className={`text-2xl font-orbitron ${color}`}>{value}</span>
    </div>
    <p className="text-gray-400 font-play">{label}</p>
  </motion.div>
)

interface Achievement {
  event: string
  placement: number
  ctfPoints: number
  ratingPoints: number
  year: number
  eventUrl: string
}

const achievements: Achievement[] = [
  // 2025
  {
    event: "Texas Security Awareness Week 2025",
    placement: 3,
    ctfPoints: 7835,
    ratingPoints: 38.025,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2736",
  },
  {
    event: "squ1rrel CTF 2025",
    placement: 237,
    ctfPoints: 654,
    ratingPoints: 1.484,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2708",
  },
  {
    event: "PlaidCTF 2025",
    placement: 243,
    ctfPoints: 43,
    ratingPoints: 1.404,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2508",
  },
  {
    event: "JerseyCTF V",
    placement: 19,
    ctfPoints: 19433,
    ratingPoints: 13.213,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2667",
  },
  {
    event: "TAMUctf 2025",
    placement: 46,
    ctfPoints: 1120,
    ratingPoints: 8.291,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2681",
  },
  {
    event: "WolvCTF 2025",
    placement: 57,
    ctfPoints: 4039,
    ratingPoints: 13.737,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2579",
  },
  {
    event: "pingCTF 2025",
    placement: 136,
    ctfPoints: 50,
    ratingPoints: 0.488,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2670",
  },
  {
    event: "UTCTF 2025",
    placement: 151,
    ctfPoints: 4654,
    ratingPoints: 21.533,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2641",
  },
  {
    event: "PwnMe CTF Quals 2025",
    placement: 219,
    ctfPoints: 250,
    ratingPoints: 0.755,
    year: 2025,
    eventUrl: "https://ctftime.org/event/2658",
  },
  // 2024
  {
    event: "vsCTF 2024",
    placement: 86,
    ctfPoints: 2509,
    ratingPoints: 7.963,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2248",
  },
  {
    event: "BCACTF 5.0",
    placement: 272,
    ctfPoints: 510,
    ratingPoints: 4.168,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2274",
  },
  {
    event: "BTCTF I",
    placement: 98,
    ctfPoints: 1740,
    ratingPoints: 0,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2340",
  },
  {
    event: "UMDCTF 2024",
    placement: 118,
    ctfPoints: 1937,
    ratingPoints: 6.772,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2323",
  },
  {
    event: "UMassCTF 2024",
    placement: 207,
    ctfPoints: 310,
    ratingPoints: 1.607,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2287",
  },
  {
    event: "PlaidCTF 2024",
    placement: 79,
    ctfPoints: 151,
    ratingPoints: 5.052,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2245",
  },
  {
    event: "SwampCTF 2024",
    placement: 190,
    ctfPoints: 200,
    ratingPoints: 1.404,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2138",
  },
  {
    event: "AmateursCTF 2024",
    placement: 59,
    ctfPoints: 3376,
    ratingPoints: 6.291,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2226",
  },
  {
    event: "UTCTF 2024",
    placement: 52,
    ctfPoints: 9697,
    ratingPoints: 23.616,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2302",
  },
  {
    event: "JerseyCTF IV",
    placement: 121,
    ctfPoints: 2846,
    ratingPoints: 2.342,
    year: 2024,
    eventUrl: "https://ctftime.org/event/2230",
  },
  {
    event: "NahamCon CTF 2023",
    placement: 8,
    ctfPoints: 17268,
    ratingPoints: 34.026,
    year: 2023,
    eventUrl: "https://ctftime.org/event/2023",
  },
]

type YearFilter = number | "all"

export default function Achievements() {
  const [selectedYear, setSelectedYear] = useState<YearFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Achievement
    direction: "asc" | "desc"
  }>({ key: "year", direction: "desc" })

  const years: YearFilter[] = ["all", 2025, 2024, 2023]

  const filteredAchievements = useMemo(() => {
    let filtered = [...achievements]

    if (selectedYear !== "all") {
      filtered = filtered.filter((a) => a.year === selectedYear)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((a) => a.event.toLowerCase().includes(query))
    }

    return filtered.sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })
  }, [selectedYear, sortConfig, searchQuery])

  const stats = useMemo(() => {
    const yearStats = filteredAchievements.reduce(
      (acc, curr) => ({
        totalCtfPoints: acc.totalCtfPoints + curr.ctfPoints,
        totalRatingPoints: acc.totalRatingPoints + curr.ratingPoints,
        bestPlacement: Math.min(acc.bestPlacement, curr.placement),
        eventCount: acc.eventCount + 1,
      }),
      {
        totalCtfPoints: 0,
        totalRatingPoints: 0,
        bestPlacement: Infinity,
        eventCount: 0,
      }
    )

    return [
      {
        label: "Best Placement",
        value: `#${yearStats.bestPlacement}`,
        icon: FiAward,
        color: "text-custom-yellow",
      },
      {
        label: "Total CTF Points",
        value: yearStats.totalCtfPoints.toLocaleString(),
        icon: FiTarget,
        color: "text-custom-blue",
      },
      {
        label: "Rating Points",
        value: yearStats.totalRatingPoints.toFixed(3),
        icon: FiTrendingUp,
        color: "text-custom-pink",
      },
      {
        label: "Events Participated",
        value: yearStats.eventCount.toString(),
        icon: FiFlag,
        color: "text-green-500",
      },
    ]
  }, [filteredAchievements])

  const handleSort = (key: keyof Achievement) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }))
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-6 mb-12">
          <h1 className="text-4xl font-orbitron text-center font-bold">
            <span className="text-custom-blue">Team</span>{" "}
            <span className="text-custom-pink">Achievements</span>
          </h1>

          <a
            href="https://ctftime.org/team/283028"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-custom-blue hover:text-custom-pink transition-colors"
          >
            <span className="font-play">View on CTFtime</span>
            <FiExternalLink className="w-4 h-4" />
          </a>

          {/* Search Bar */}
          <div className="w-full max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-blue/50" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-custom-blue/30 
                rounded-lg focus:border-custom-blue/60 focus:outline-none text-white
                placeholder:text-custom-blue/50 transition-colors font-play"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex justify-center space-x-4">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedYear === year
                    ? "bg-custom-blue text-black font-medium"
                    : "border border-custom-blue/50 text-custom-blue hover:border-custom-blue"
                }`}
              >
                {year === "all" ? "All Years" : year}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-play">
            No events found matching your search.
          </div>
        ) : (
          /* Achievements Table */
          <div className="overflow-x-auto rounded-lg border border-custom-blue/20">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b-2 border-custom-blue/30 bg-custom-black/30">
                  <th
                    onClick={() => handleSort("event")}
                    className="py-4 px-6 font-orbitron text-custom-blue cursor-pointer hover:text-custom-pink transition-colors"
                  >
                    Event
                  </th>
                  <th
                    onClick={() => handleSort("year")}
                    className="py-4 px-6 font-orbitron text-custom-blue cursor-pointer hover:text-custom-pink transition-colors"
                  >
                    Year
                  </th>
                  <th
                    onClick={() => handleSort("placement")}
                    className="py-4 px-6 font-orbitron text-custom-blue cursor-pointer hover:text-custom-pink transition-colors"
                  >
                    Placement
                  </th>
                  <th
                    onClick={() => handleSort("ctfPoints")}
                    className="py-4 px-6 font-orbitron text-custom-blue cursor-pointer hover:text-custom-pink transition-colors"
                  >
                    CTF Points
                  </th>
                  <th
                    onClick={() => handleSort("ratingPoints")}
                    className="py-4 px-6 font-orbitron text-custom-blue cursor-pointer hover:text-custom-pink transition-colors"
                  >
                    Rating Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAchievements.map((achievement, index) => (
                  <motion.tr
                    key={achievement.event}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-custom-blue/10 hover:bg-custom-blue/5 transition-colors"
                  >
                    <td className="py-4 px-6 font-play">
                      <a
                        href={achievement.eventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-custom-pink transition-colors"
                      >
                        <FiAward className="text-custom-yellow" />
                        <span>{achievement.event}</span>
                        <FiExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    </td>
                    <td className="py-4 px-6 font-share-tech text-gray-400">
                      {achievement.year}
                    </td>
                    <td className="py-4 px-6 font-orbitron text-custom-pink">
                      #{achievement.placement}
                    </td>
                    <td className="py-4 px-6 font-share-tech">
                      {achievement.ctfPoints.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-share-tech text-green-500">
                      {achievement.ratingPoints.toFixed(3)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
