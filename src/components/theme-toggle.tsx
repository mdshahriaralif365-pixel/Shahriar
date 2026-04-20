"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const toggle = () => setTheme(isDark ? "light" : "dark")

  return (
    <motion.button
      onClick={toggle}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 overflow-hidden"
      style={{
        background: mounted 
          ? (isDark ? "oklch(0.72 0.22 295 / 0.1)" : "oklch(0.55 0.24 295 / 0.08)")
          : "transparent",
        borderColor: mounted
          ? (isDark ? "oklch(0.72 0.22 295 / 0.3)" : "oklch(0.55 0.24 295 / 0.25)")
          : "transparent",
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9, rotate: 15 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              style={{ color: "oklch(0.85 0.18 295)" }}
            >
              <Moon className="h-4.5 w-4.5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              style={{ color: "oklch(0.45 0.22 295)" }}
            >
              <Sun className="h-4.5 w-4.5" />
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Subtle background gleam on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0"
        style={{ background: "var(--gradient-primary)" }}
        whileHover={{ opacity: 0.08 }}
      />
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  )
}
