"use client"

import { motion, useScroll, useTransform, Variants } from "framer-motion"
import { ArrowRight, Mail, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TwitterIcon, FacebookIcon, InstagramIcon, GithubIcon, LinkedinIcon } from "@/components/icons"
import { useRef, useState, useEffect } from "react"

interface SocialLinks {
  github: string | null
  linkedin: string | null
  twitter?: string | null
  facebook?: string | null
  instagram?: string | null
}

interface HeroData {
  welcomeText: string
  name: string
  role: string
  description: string
  avatarText: string
  avatarSubtext: string
  avatarImage?: string | null
  badge1?: string
  badge2?: string
  badge3?: string
  showBadges?: boolean
}

/* ─── Floating particle dot ─── */
function Particle({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{ y: [-20, -80, -20], opacity: [0, 0.8, 0], scale: [1, 0.4, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  )
}

/* ─── Orbiting dot (currently unused) ─── */
/*
function OrbitDot({ radius, duration, delay, color }: { radius: number; duration: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: 8, height: 8, background: color, top: "50%", left: "50%", marginTop: -4, marginLeft: -4 }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      transformOrigin={`${radius}px 50%`}
    >
      <motion.div
        className="w-full h-full rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
      />
    </motion.div>
  )
}
*/

const socialIconClass = "p-2.5 rounded-xl bg-secondary/40 hover:bg-primary hover:text-primary-foreground transition-all duration-500 border border-border/50 flex items-center justify-center hover:shadow-[0_0_20px_oklch(0.55_0.24_295_/_0.5)] hover:border-primary/50 hover:scale-110 hover:-translate-y-1"

export function Hero({ socialLinks, heroData }: { socialLinks?: SocialLinks, heroData?: HeroData }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  
  // Adjusted parallax for mobile to avoid overlap
  const [parallaxValue, setParallaxValue] = useState("30%")
  
  useEffect(() => {
    const checkMobile = () => setParallaxValue(window.innerWidth < 768 ? "12%" : "30%")
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const y = useTransform(scrollYProgress, [0, 1], ["0%", parallaxValue])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const github    = socialLinks?.github    || "https://github.com"
  const linkedin  = socialLinks?.linkedin  || "https://linkedin.com"
  const twitter   = socialLinks?.twitter
  const facebook  = socialLinks?.facebook
  const instagram = socialLinks?.instagram

  const welcome   = heroData?.welcomeText || "👋 Welcome to my portfolio"
  const name      = heroData?.name        || "Shahriar Alif"
  const role      = heroData?.role        || "Senior Full-Stack Developer & UI/UX Designer"
  const description = heroData?.description || "I craft exceptional, high-performance web experiences that blend beautiful design with rock-solid engineering."
  const avText    = heroData?.avatarText    || "SA."
  const avSubtext = heroData?.avatarSubtext || "Developer"

  const particles = [
    { x: "8%",  y: "70%", size: 6,  delay: 0,   color: "oklch(0.55 0.24 295 / 0.6)" },
    { x: "18%", y: "40%", size: 4,  delay: 1.2, color: "oklch(0.65 0.2 180 / 0.5)" },
    { x: "75%", y: "75%", size: 5,  delay: 0.7, color: "oklch(0.7 0.2 340 / 0.5)" },
    { x: "85%", y: "30%", size: 7,  delay: 1.8, color: "oklch(0.55 0.24 295 / 0.5)" },
    { x: "45%", y: "85%", size: 4,  delay: 0.4, color: "oklch(0.65 0.2 180 / 0.4)" },
    { x: "60%", y: "15%", size: 5,  delay: 2.2, color: "oklch(0.72 0.22 295 / 0.5)" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  }

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[calc(100vh-1rem)] lg:min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden pt-14 pb-24 sm:py-20"
    >
      {/* ── Animated mesh background ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Large gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.24 295), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-15"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.2 180), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-15 dark:opacity-10"
          style={{
            background: "radial-gradient(circle, oklch(0.7 0.2 340), transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.55 0.24 295) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.55 0.24 295) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      <motion.div
        className="container relative z-10 px-5 sm:px-8 mx-auto"
        style={{ y, opacity }}
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* ── Left: Text Content ── */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <motion.span
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border backdrop-blur-sm"
                style={{
                  background: "oklch(0.55 0.24 295 / 0.1)",
                  borderColor: "oklch(0.55 0.24 295 / 0.3)",
                  color: "oklch(0.45 0.22 295)",
                }}
                whileHover={{ scale: 1.04 }}
              >
                <motion.span
                  animate={{ rotate: [0, 20, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="dark:hidden"
                  style={{ color: "oklch(0.45 0.22 295)" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
                <motion.span
                  animate={{ rotate: [0, 20, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="hidden dark:inline"
                  style={{ color: "oklch(0.85 0.18 295)" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
                <span className="dark:hidden" style={{ color: "oklch(0.4 0.22 295)" }}>{welcome}</span>
                <span className="hidden dark:inline" style={{ color: "oklch(0.85 0.18 295)" }}>{welcome}</span>
              </motion.span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl/none font-extrabold tracking-tighter text-foreground leading-[1.2] sm:leading-tight">
                Hi, I&apos;m{" "}
                <span className="relative inline-block">
                  <span className="text-gradient font-black">{name}</span>
                  {/* Underline decoration */}
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 rounded-full"
                    style={{ background: "var(--gradient-primary)" }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                  />
                </span>
              </h1>
              <motion.h2
                variants={itemVariants}
                className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground/70 tracking-tight leading-snug"
              >
                {role}
              </motion.h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="max-w-[560px] text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-relaxed"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col xs:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full xs:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="w-full xs:w-auto h-12 sm:h-13 px-8 font-bold rounded-2xl transition-all shadow-lg"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "0 8px 30px oklch(0.55 0.24 295 / 0.4)",
                  }}
                >
                  <Link href="#projects">
                    View My Work
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full xs:w-auto">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full xs:w-auto h-12 sm:h-13 px-8 font-bold rounded-2xl border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-all backdrop-blur-sm"
                >
                  <Link href="#contact">
                    Get In Touch
                    <Mail className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">Follow</span>
              <div className="w-8 h-px bg-border" />
              {github && (
                <motion.a href={github} target="_blank" className={socialIconClass} whileHover={{ y: -3 }}>
                  <GithubIcon className="w-4 h-4" />
                </motion.a>
              )}
              {linkedin && (
                <motion.a href={linkedin} target="_blank" className={socialIconClass} whileHover={{ y: -3 }}>
                  <LinkedinIcon className="w-4 h-4" />
                </motion.a>
              )}
              {twitter && (
                <motion.a href={twitter} target="_blank" className={socialIconClass} whileHover={{ y: -3 }}>
                  <TwitterIcon className="w-4 h-4" />
                </motion.a>
              )}
              {facebook && (
                <motion.a href={facebook} target="_blank" className={socialIconClass} whileHover={{ y: -3 }}>
                  <FacebookIcon className="w-4 h-4" />
                </motion.a>
              )}
              {instagram && (
                <motion.a href={instagram} target="_blank" className={socialIconClass} whileHover={{ y: -3 }}>
                  <InstagramIcon className="w-4 h-4" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* ── Right: Avatar Visual ── */}
          <motion.div
            className="flex items-center justify-center lg:justify-end mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          >
            <div className="relative w-56 h-56 xs:w-72 xs:h-72 sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px]">

              {/* Outer spinning ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, oklch(0.55 0.24 295 / 0.5), oklch(0.65 0.2 180 / 0.5), oklch(0.55 0.24 295 / 0))",
                  padding: "2px",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </motion.div>

              {/* Middle dashed ring */}
              <motion.div
                className="absolute inset-6 rounded-full border border-dashed"
                style={{ borderColor: "oklch(0.55 0.24 295 / 0.25)" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              >
                {/* Dot on ring 1 */}
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              </motion.div>

              {/* Inner ring */}
              <motion.div
                className="absolute inset-12 rounded-full border border-dashed"
                style={{ borderColor: "oklch(0.65 0.2 180 / 0.2)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                  style={{ background: "oklch(0.65 0.2 180)" }}
                />
              </motion.div>

              {/* Central Avatar */}
              <motion.div
                className="absolute inset-[15%] rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, oklch(0.55 0.24 295 / 0.15), oklch(0.65 0.2 180 / 0.10))",
                  border: "1px solid oklch(0.55 0.24 295 / 0.3)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 60px oklch(0.55 0.24 295 / 0.3), inset 0 0 40px oklch(0.55 0.24 295 / 0.05)",
                }}
                animate={{ boxShadow: ["0 0 40px oklch(0.55 0.24 295 / 0.2)", "0 0 80px oklch(0.55 0.24 295 / 0.45)", "0 0 40px oklch(0.55 0.24 295 / 0.2)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {heroData?.avatarImage ? (
                  <div className="relative w-full h-full">
                    <Image src={heroData.avatarImage} alt={name} fill className="object-cover" priority />
                  </div>
                ) : (
                  <div className="text-center select-none px-4">
                    <motion.span
                      className="text-4xl xs:text-6xl sm:text-7xl font-black tracking-tighter block mb-1 text-gradient"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {avText}
                    </motion.span>
                    <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "oklch(0.65 0.2 180)" }}>
                      {avSubtext}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Floating skill badges */}
              {heroData?.showBadges !== false && [
                { label: heroData?.badge1 || "React",    angle: -45, r: "48%", delay: 0,   bg: "oklch(0.55 0.24 295)" },
                { label: heroData?.badge2 || "Next.js",  angle: 90,  r: "48%", delay: 0.5, bg: "oklch(0.65 0.2 180)" },
                { label: heroData?.badge3 || "Node.js",  angle: 220, r: "48%", delay: 1,   bg: "oklch(0.7 0.18 340)" },
              ].map(({ label, angle, r, delay, bg }) => {
                const rad = (angle * Math.PI) / 180
                const x = (50 + parseFloat(r) * Math.cos(rad)).toFixed(2)
                const y = (50 + parseFloat(r) * Math.sin(rad)).toFixed(2)
                return (
                  <motion.div
                    key={label}
                    className="absolute px-2 py-1 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[11px] font-bold text-white shadow-xl whitespace-nowrap"
                    style={{ background: bg, left: `${x}%`, top: `${y}%`, transformOrigin: "center center" }}
                    initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                    animate={{ opacity: 1, scale: 1, y: ["-50%", "-60%", "-50%"] }}
                    transition={{ 
                      opacity: { delay: delay + 1, duration: 0.5 },
                      scale: { delay: delay + 1, duration: 0.5 },
                      y: { duration: 3, repeat: Infinity, repeatDelay: delay } 
                    }}
                  >
                    {label}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Scroll</span>
          <motion.div
            className="w-5 h-8 rounded-full border-2 border-primary/40 flex items-start justify-center p-1"
            animate={{ borderColor: ["oklch(0.55 0.24 295 / 0.4)", "oklch(0.65 0.2 180 / 0.6)", "oklch(0.55 0.24 295 / 0.4)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
