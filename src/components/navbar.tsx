"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import Image from "next/image"

const defaultLinks = [
  { name: "Home",       href: "/",           isActive: true },
  { name: "About",      href: "#about",       isActive: true },
  { name: "Skills",     href: "#skills",      isActive: true },
  { name: "Projects",   href: "#projects",    isActive: true },
  { name: "Experience", href: "#experience",  isActive: true },
  { name: "Contact",    href: "#contact",     isActive: true },
]

interface NavLink { name: string; href: string; isActive?: boolean }

interface NavbarSettings {
  logoText: string
  logoImage?: string | null
  showCTA: boolean
  ctaText?: string | null
  ctaLink?: string | null
  navLinks: NavLink[]
}

export function Navbar({ settings }: { settings?: NavbarSettings | null }) {
  const [isOpen,        setIsOpen]        = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("Home")
  const [scrolled,      setScrolled]      = React.useState(false)
  const pathname = usePathname()

  const links = React.useMemo(
    () => (settings?.navLinks && settings.navLinks.length > 0
      ? settings.navLinks
      : defaultLinks
    ).filter(l => l.isActive !== false),
    [settings],
  )

  const logoText = settings?.logoText || "ALIF."

  /* ── scroll tracking ── */
  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = links.map(l => l.href.replace("#", "")).filter(Boolean)
      const pos = window.scrollY + 110

      if (window.scrollY < 50) { setActiveSection("Home"); return }
      for (const s of sections) {
        const el = document.getElementById(s)
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveSection(links.find(l => l.href === `#${s}`)?.name || "Home")
          break
        }
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [links])

  if (pathname.startsWith("/admin")) return null

  return (
    <>
      <motion.header
        className={`fixed z-50 transition-all duration-500 ${
          scrolled 
            ? "top-4 left-4 right-4 md:left-8 md:right-8" 
            : "top-0 left-0 right-0"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: scrolled
            ? "oklch(from var(--background) l c h / 80%)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          border: scrolled ? "1px solid oklch(0.5 0.2 295 / 0.12)" : "none",
          borderTop: scrolled ? "1px solid oklch(0.5 0.2 295 / 0.15)" : "none",
          borderRadius: scrolled ? "24px" : "0px",
          boxShadow: scrolled ? "0 8px 32px oklch(0.55 0.24 295 / 0.12)" : "none",
        }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center group">
            {settings?.logoImage ? (
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-8 w-32"
              >
                <Image
                  src={settings.logoImage}
                  alt={logoText}
                  fill
                  className="object-contain"
                />
              </motion.div>
            ) : (
              <motion.span
                className="font-black text-2xl tracking-tighter text-gradient select-none"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                {logoText}
              </motion.span>
            )}
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link: NavLink) => {
              const isActive = activeSection === link.name
              return (
                <Link
                  key={link.href + link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 group"
                  style={{ color: isActive ? "oklch(0.55 0.24 295)" : undefined }}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "oklch(0.55 0.24 295 / 0.1)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-200 ${isActive ? "" : "text-foreground/60 group-hover:text-foreground"}`}
                  >
                    {link.name}
                  </span>
                  {/* Underline on hover */}
                  <motion.span
                    className="absolute bottom-0.5 left-4 right-4 h-[2px] rounded-full origin-left"
                    style={{ background: "var(--gradient-primary)" }}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </Link>
              )
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {settings?.showCTA && (
              <motion.div
                className="hidden md:block"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Button
                  asChild
                  className="rounded-xl px-6 font-bold shadow-lg"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "0 4px 20px oklch(0.55 0.24 295 / 0.35)",
                  }}
                >
                  <Link href={settings.ctaLink || "#contact"}>
                    {settings.ctaText || "Hire Me"}
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Mobile toggle */}
            <motion.button
              className="md:hidden p-2 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground/80 hover:text-foreground hover:border-primary/40 transition-colors"
              onClick={() => setIsOpen(v => !v)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden border-t border-border/20"
              style={{
                background: "oklch(from var(--background) l c h / 95%)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="px-6 py-6 flex flex-col items-center gap-2">
                {links.map((link: NavLink, i) => (
                  <motion.div
                    key={link.href + link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      className={`w-full flex items-center justify-center py-3.5 px-6 rounded-2xl text-base font-bold transition-all duration-300 border ${
                        activeSection === link.name
                          ? "text-primary-foreground border-transparent shadow-lg shadow-primary/20"
                          : "text-foreground/70 hover:text-foreground bg-secondary/30 border-border/40 hover:bg-secondary/60"
                      }`}
                      style={activeSection === link.name ? { background: "var(--gradient-primary)" } : {}}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {settings?.showCTA && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: links.length * 0.06 }}
                    className="w-full mt-2"
                  >
                    <Button
                      asChild
                      className="w-full rounded-2xl h-12 font-bold shadow-lg"
                      style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "0 4px 20px oklch(0.55 0.24 295 / 0.35)",
                      }}
                    >
                      <Link href={settings.ctaLink || "#contact"} onClick={() => setIsOpen(false)}>
                        {settings.ctaText || "Hire Me"}
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  )
}
