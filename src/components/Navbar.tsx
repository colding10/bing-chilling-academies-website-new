"use client"

import Link from "next/link"
import { useState, useEffect, memo } from "react"
import { FiEye, FiEyeOff, FiMenu, FiX } from "react-icons/fi"
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

// Memo-ize NavLink component for better performance
const NavLink = memo(
  ({
    href,
    children,
    isActive,
  }: {
    href: string
    children: React.ReactNode
    isActive: boolean
  }) => (
    <Link
      href={href}
      className={`transition-colors duration-300 ${
        isActive
          ? "text-custom-pink text-glow-pink"
          : "text-custom-blue hover:text-custom-pink"
      }`}
    >
      {children}
    </Link>
  )
)

NavLink.displayName = "NavLink" // Required for memo component

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMatrixTooltipVisible, setIsMatrixTooltipVisible] = useState(false)
  const { toggleEffectsMode, effectsMode, setMatrixOpacity } =
    useBackgroundEffects()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Add passive flag for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Check initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Precompute active states for nav links
  const isHomeActive = pathname === "/"
  const isAboutActive = pathname === "/about"
  const isAchievementsActive = pathname === "/achievements"
  const isWriteupsActive = pathname?.startsWith("/writeups")

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-custom-black/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      {/* Remove container class to allow background to extend full width */}
      <div className="backdrop-blur-md bg-black bg-opacity-60 shadow-lg px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="font-orbitron text-xl text-custom-blue">
              <span className="text-glow-blue">BING CHILLING</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/" isActive={isHomeActive}>
                Home
              </NavLink>
              <NavLink href="/about" isActive={isAboutActive}>
                About
              </NavLink>
              <NavLink href="/achievements" isActive={isAchievementsActive}>
                Achievements
              </NavLink>
              <NavLink href="/writeups" isActive={isWriteupsActive}>
                Writeups
              </NavLink>
              <div className="relative">
                <button
                  onClick={() => {
                    toggleEffectsMode()
                    if (effectsMode === "none") {
                      setMatrixOpacity(0.6)
                    }
                  }}
                  onMouseEnter={() => setIsMatrixTooltipVisible(true)}
                  onMouseLeave={() => setIsMatrixTooltipVisible(false)}
                  className="p-2 rounded-full transition-colors bg-background/20 hover:bg-background/30"
                  aria-label={`${effectsMode !== "none" ? "Disable" : "Enable"} visual effects`}
                >
                  {effectsMode !== "none" ? (
                    <FiEye className="h-5 w-5 text-custom-blue" />
                  ) : (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {isMatrixTooltipVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 z-50 bg-background/90 border border-custom-blue/30 rounded-md py-1 px-2 text-xs whitespace-nowrap shadow-lg backdrop-blur-sm"
                    >
                      {effectsMode !== "none"
                        ? "Disable Matrix Effects"
                        : "Enable Matrix Effects"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-custom-blue hover:text-custom-pink"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-custom-black/90 backdrop-blur-md border-t border-custom-blue/30"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className={`${
                  isHomeActive
                    ? "text-custom-pink text-glow-pink"
                    : "text-custom-blue"
                } hover:text-custom-pink transition-colors py-2`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`${
                  isAboutActive
                    ? "text-custom-pink text-glow-pink"
                    : "text-custom-blue"
                } hover:text-custom-pink transition-colors py-2`}
              >
                About
              </Link>
              <Link
                href="/achievements"
                className={`${
                  isAchievementsActive
                    ? "text-custom-pink text-glow-pink"
                    : "text-custom-blue"
                } hover:text-custom-pink transition-colors py-2`}
              >
                Achievements
              </Link>
              <Link
                href="/writeups"
                className={`${
                  isWriteupsActive
                    ? "text-custom-pink text-glow-pink"
                    : "text-custom-blue"
                } hover:text-custom-pink transition-colors py-2`}
              >
                Writeups
              </Link>

              {/* Mobile effects toggle */}
              <button
                onClick={() => {
                  toggleEffectsMode()
                  if (effectsMode === "none") {
                    setMatrixOpacity(0.6)
                  }
                }}
                className="flex items-center gap-2 py-2 text-custom-blue hover:text-custom-pink transition-colors"
              >
                {effectsMode !== "none" ? (
                  <>
                    <FiEye className="h-5 w-5" />
                    <span>Disable Matrix Effects</span>
                  </>
                ) : (
                  <>
                    <FiEyeOff className="h-5 w-5" />
                    <span>Enable Matrix Effects</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
