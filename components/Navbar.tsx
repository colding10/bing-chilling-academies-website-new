"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="border-b-2 border-custom-blue/30 bg-custom-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-orbitron text-custom-blue">
            BING CHILLING CTF TEAM
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              About
            </Link>
            <Link
              href="/achievements"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              Achievements
            </Link>
            <Link
              href="/writeups"
              className="text-custom-blue hover:text-custom-pink transition-colors"
            >
              Writeups
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-custom-blue/30 hover:border-custom-blue transition-colors"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-custom-yellow" />
              ) : (
                <MoonIcon className="h-5 w-5 text-custom-blue" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
