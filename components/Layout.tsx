"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import MatrixRain from "./MatrixRain";
import ParticleField from "./ParticleField";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen cyber-grid relative">
        <MatrixRain />
        <ParticleField />
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
