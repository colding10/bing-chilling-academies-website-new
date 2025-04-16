"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface TeamMember {
  name: string;
  handle: string;
  role: string;
  specialties: string[];
  image: string;
  bio: string;
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Chen",
    handle: "ByteMaster",
    role: "Team Leader",
    specialties: [
      "Reverse Engineering",
      "Binary Exploitation",
      "Malware Analysis",
    ],
    image: "/images/team/alex.jpg", // Add your images to public/images/team/
    bio: "Security researcher with 5+ years of experience in reverse engineering and malware analysis. Previously worked at major tech companies and contributed to various open-source security tools.",
    socials: {
      twitter: "https://twitter.com/bytemaster",
      github: "https://github.com/bytemaster",
      linkedin: "https://linkedin.com/in/bytemaster",
    },
  },
  {
    name: "Sarah Williams",
    handle: "WebWizard",
    role: "Web Security Specialist",
    specialties: ["Web Exploitation", "API Security", "OSINT"],
    image: "/images/team/sarah.jpg",
    bio: "Full-stack developer turned security specialist. Expert in modern web technologies and their vulnerabilities. Regular speaker at security conferences.",
    socials: {
      twitter: "https://twitter.com/webwizard",
      github: "https://github.com/webwizard",
    },
  },
  // Add more team members here
];

export default function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-center mb-4">
          <span className="text-primary">Meet</span>{" "}
          <span className="text-secondary">The</span>{" "}
          <span className="text-accent">Team</span>
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
          A diverse group of security enthusiasts pushing the boundaries of
          cybersecurity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.handle}
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 backdrop-blur-sm border-2 border-primary 
            rounded-xl overflow-hidden relative group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl text-glow">
                  {member.name}
                  <span className="block text-sm text-primary">
                    @{member.handle}
                  </span>
                </h3>
              </div>
              <div className="p-6 relative z-10">
                <p className="text-secondary font-semibold mb-2">
                  {member.role}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-primary/10 border border-primary/30 
                    rounded-full text-sm text-primary"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm">
                  {member.bio.substring(0, 150)}...
                </p>
              </div>
              <div className="absolute inset-0 scanline opacity-30" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal for detailed member view */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMember(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-6">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                <p className="text-primary">@{selectedMember.handle}</p>
                <p className="text-secondary mt-2">{selectedMember.role}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMember.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedMember.bio}
              </p>
              <div className="flex gap-4 mt-6">
                {selectedMember.socials.twitter && (
                  <a
                    href={selectedMember.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary"
                  >
                    Twitter
                  </a>
                )}
                {selectedMember.socials.github && (
                  <a
                    href={selectedMember.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary"
                  >
                    GitHub
                  </a>
                )}
                {selectedMember.socials.linkedin && (
                  <a
                    href={selectedMember.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
