"use client"

import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section id="home" className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-20">
      {/* Background decoration elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[oklch(0.5_0.15_250)]/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div 
            className="flex flex-col justify-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium border border-primary/20 backdrop-blur-sm">
                👋 Welcome to my portfolio
              </motion.div>
              <motion.h1 
                variants={itemVariants}
                className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground"
              >
                Hi, I&apos;m <span className="text-primary">Shahriar Alif</span>
              </motion.h1>
              <motion.h2 
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-bold text-foreground/80 tracking-tight"
              >
                Senior Full-Stack Web Developer & UI/UX Designer
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="max-w-[600px] text-muted-foreground md:text-lg leading-relaxed"
              >
                I specialize in building exceptional, dynamic, and high-performance web applications. Turning complex problems into beautiful, intuitive interfaces is my passion.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-12 px-8 font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                <Link href="#projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 font-medium group rounded-full border-primary/30 hover:bg-primary/10 transition-all">
                <Link href="#contact">
                  Contact Me
                  <Mail className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
              <Link href="https://github.com/shahriar-alif" target="_blank" className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://linkedin.com/in/shahriar-alif" target="_blank" className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative w-72 h-72 sm:w-[400px] sm:h-[400px]">
              {/* Animated geometric rings */}
              <motion.div 
                className="absolute inset-0 rounded-full border-[3px] border-primary/20 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-8 rounded-full border-2 border-foreground/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              {/* Profile / Avatar element */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-primary/30 to-background backdrop-blur-3xl overflow-hidden border border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.2)]">
                <div className="text-center">
                  <span className="text-7xl font-black text-foreground/80 tracking-tighter block mb-2">SA.</span>
                  <span className="text-sm font-medium text-primary uppercase tracking-widest">Developer</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
