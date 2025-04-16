'use client'

import { motion } from 'framer-motion'
import { FiTarget, FiFlag, FiZap, FiTrendingUp, FiAward } from 'react-icons/fi'

interface StatCardProps {
  label: string
  value: string
  color: string
  icon: React.ElementType
}

interface Achievement {
  event: string
  date: string
  placement: string
  points: number
  solved: number
  firstBloods: number
  ratingGain: number
  categories: string[]
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

const achievements: Achievement[] = [
  {
    event: "DEFCON CTF 2023",
    date: "August 2023",
    placement: "3rd Place",
    points: 15420,
    solved: 28,
    firstBloods: 3,
    ratingGain: 245,
    categories: ["pwn", "crypto", "web"]
  },
  {
    event: "Google CTF 2023",
    date: "June 2023",
    placement: "5th Place",
    points: 12850,
    solved: 22,
    firstBloods: 1,
    ratingGain: 178,
    categories: ["reversing", "web", "misc"]
  },
  {
    event: "PlaidCTF 2023",
    date: "April 2023",
    placement: "7th Place",
    points: 10240,
    solved: 19,
    firstBloods: 2,
    ratingGain: 156,
    categories: ["crypto", "forensics", "web"]
  },
]

export default function Achievements() {
  const stats = [
    {
      label: "Total Points",
      value: "38,510",
      icon: FiTarget,
      color: "text-custom-blue"
    },
    {
      label: "Challenges Solved",
      value: "69",
      icon: FiFlag,
      color: "text-custom-pink"
    },
    {
      label: "First Bloods",
      value: "6",
      icon: FiZap,
      color: "text-custom-yellow"
    },
    {
      label: "Rating Gain",
      value: "+579",
      icon: FiTrendingUp,
      color: "text-green-500"
    },
  ]

  return (
    <div className="max-w-7xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-orbitron text-center mb-12">
          <span className="text-custom-blue">Team</span>{' '}
          <span className="text-custom-pink">Achievements</span>
        </h1>

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

        {/* Achievements Table */}
        <div className="overflow-x-auto rounded-lg border border-custom-blue/20">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-custom-blue/30 bg-custom-black/30">
                <th className="py-4 px-6 font-orbitron text-custom-blue">Event</th>
                <th className="py-4 px-6 font-orbitron text-custom-blue">Date</th>
                <th className="py-4 px-6 font-orbitron text-custom-blue">Placement</th>
                <th className="py-4 px-6 font-orbitron text-custom-blue">Points</th>
                <th className="py-4 px-6 font-orbitron text-custom-blue">Solved</th>
                <th className="py-4 px-6 font-orbitron text-custom-blue">First Bloods</th>
                <th className="py-4 px-6 font-orbitron text-custom-blue">Rating Gain</th>
                <th className="py-4 px-6 font-orbitron text-custom-blue">Categories</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((achievement, index) => (
                <motion.tr
                  key={achievement.event}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-custom-blue/10 hover:bg-custom-blue/5 transition-colors"
                >
                  <td className="py-4 px-6 font-play">
                    <div className="flex items-center space-x-2">
                      <FiAward className="text-custom-yellow" />
                      <span>{achievement.event}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-share-tech text-gray-400">{achievement.date}</td>
                  <td className="py-4 px-6 font-orbitron text-custom-pink">{achievement.placement}</td>
                  <td className="py-4 px-6 font-share-tech">{achievement.points.toLocaleString()}</td>
                  <td className="py-4 px-6 font-share-tech">{achievement.solved}</td>
                  <td className="py-4 px-6 font-share-tech text-custom-yellow">{achievement.firstBloods}</td>
                  <td className="py-4 px-6 font-share-tech text-green-500">+{achievement.ratingGain}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {achievement.categories.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 text-xs font-play bg-custom-blue/10 
                          border border-custom-blue/30 rounded-full text-custom-blue"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
