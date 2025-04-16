"use client";

import { motion } from "framer-motion";
import { FiTarget, FiFlag, FiZap, FiServer } from "react-icons/fi";
import TerminalText from "@/components/TerminalText";
import HologramCard from "@/components/HologramCard";

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  icon: React.ElementType;
}

const StatCard = ({ label, value, color, icon: Icon }: StatCardProps) => (
  <HologramCard className="hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <Icon className={`w-8 h-8 ${color}`} />
      <span className={`text-2xl font-orbitron ${color}`}>{value}</span>
    </div>
    <p className="text-gray-400 font-play">{label}</p>
  </HologramCard>
);

export default function Home() {
  const stats = [
    {
      label: "CTFs Played",
      value: "50+",
      icon: FiTarget,
      color: "text-custom-blue",
    },
    {
      label: "Flags Captured",
      value: "1000+",
      icon: FiFlag,
      color: "text-custom-pink",
    },
    {
      label: "First Bloods",
      value: "42",
      icon: FiZap,
      color: "text-custom-yellow",
    },
    {
      label: "Global Ranking",
      value: "Top 100",
      icon: FiServer,
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        {/* Title with data corruption effect */}
        <h1 className="text-6xl font-bold mb-6 relative">
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
        </h1>

        {/* Terminal text effect */}
        <div className="mb-12">
          <TerminalText
            text="Arnav adepu cant stop yapping about this so here you go"
            speed={70}
          />
        </div>

        {/* Stats grid with hologram cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            </motion.div>
          ))}
        </div>

        {/* Featured section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <HologramCard className="max-w-2xl mx-auto">
            <h2
              className="text-2xl font-orbitron text-custom-blue mb-4 cyber-tooltip"
              data-tooltip="Latest Achievement"
            >
              Recent Victory
            </h2>
            <div className="space-y-4">
              <p className="text-gray-400 font-play">
                🏆 Secured 3rd place in DEFCON CTF 2023
              </p>
              <div className="flex justify-center gap-4">
                <span
                  className="px-3 py-1 bg-custom-blue/10 border border-custom-blue/30 
                      rounded-full text-sm text-custom-blue"
                >
                  28 Challenges Solved
                </span>
                <span
                  className="px-3 py-1 bg-custom-pink/10 border border-custom-pink/30 
                      rounded-full text-sm text-custom-pink"
                >
                  3 First Bloods
                </span>
                <span
                  className="px-3 py-1 bg-custom-yellow/10 border border-custom-yellow/30 
                      rounded-full text-sm text-custom-yellow"
                >
                  15,420 Points
                </span>
              </div>
            </div>
          </HologramCard>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <a
            href="/writeups"
            className="cyber-button-small cyber-tooltip"
            data-tooltip="View our latest writeups"
          >
            Explore Writeups
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
