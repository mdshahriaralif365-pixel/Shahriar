"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, ArrowUp } from "lucide-react"

interface FooterSettings {
  copyrightText: string
  builtWithText: string
  creditName: string
  creditLink: string
}

export function Footer({ settings }: { settings?: FooterSettings | null }) {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null

  const builtWith   = settings?.builtWithText || "Built with"
  const creditName  = settings?.creditName    || "Shahriar Alif"
  const creditLink  = settings?.creditLink    || "/"
  const copyright   = (settings?.copyrightText || "All rights reserved © {year}.").replace(
    "{year}",
    new Date().getFullYear().toString(),
  )

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="relative overflow-hidden border-t" style={{ borderColor: "oklch(0.55 0.24 295 / 0.15)" }}>
      {/* Subtle gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.55 0.24 295 / 0.5) 50%, transparent)" }}
      />

      {/* Background glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 100% at 50% 100%, oklch(0.55 0.24 295 / 0.05), transparent)",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">

          {/* Left: built with */}
          <motion.p
            className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {builtWith}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Heart
                className="w-4 h-4 fill-current"
                style={{ color: "oklch(0.7 0.2 340)" }}
              />
            </motion.span>
            by
            <Link
              href={creditLink}
              className="font-bold text-gradient hover:opacity-80 transition-opacity"
            >
              {creditName}
            </Link>
          </motion.p>

          {/* Center: copyright */}
          <motion.p
            className="text-xs text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {copyright}
          </motion.p>

          {/* Right: scroll to top */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to top
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center border transition-all group-hover:border-primary group-hover:text-primary group-hover:shadow-lg"
              style={{ borderColor: "var(--border)" }}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
