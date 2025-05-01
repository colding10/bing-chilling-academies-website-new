import Link from "next/link"
import { memo } from "react"
import { FiCode, FiUser, FiAward, FiFileText, FiGithub } from "react-icons/fi"

export default memo(function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-custom-blue/20 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <Link href="/" className="font-orbitron text-xl text-custom-blue">
              <span className="text-glow-blue">BING CHILLING</span>
            </Link>
            <p className="text-gray-400 text-sm mt-1">
              © {currentYear} Bing Chilling Academies CTF Team
            </p>
          </div>

          <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-sm mb-4 md:mb-0">
            <Link
              href="/about"
              className="text-gray-400 hover:text-custom-blue transition-colors flex items-center gap-1"
            >
              <FiUser className="text-custom-pink" /> <span>About</span>
            </Link>
            <Link
              href="/achievements"
              className="text-gray-400 hover:text-custom-blue transition-colors flex items-center gap-1"
            >
              <FiAward className="text-custom-yellow" />{" "}
              <span>Achievements</span>
            </Link>
            <Link
              href="/writeups"
              className="text-gray-400 hover:text-custom-blue transition-colors flex items-center gap-1"
            >
              <FiFileText className="text-custom-blue" /> <span>Writeups</span>
            </Link>
          </nav>

          <div className="flex gap-4">
            <a
              href="https://github.com/codieboomboom/bing-chilling-academies-website-new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-custom-blue transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://ctftime.org/team/283028"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-custom-blue transition-colors"
              aria-label="CTFTime Profile"
            >
              <FiCode size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
})
