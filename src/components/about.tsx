"use client"

import { motion } from "framer-motion"
import { Code2, Laptop, Rocket, Sparkles } from "lucide-react"

interface AboutData {
  bio: string
  card1Title: string; card1Desc: string
  card2Title: string; card2Desc: string
  card3Title: string; card3Desc: string
}

/* ── Section Heading ── */
function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-center mb-16"
    >
      <motion.span
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
        style={{
          background: "oklch(0.55 0.24 295 / 0.1)",
          color: "oklch(0.45 0.22 295)",
          border: "1px solid oklch(0.55 0.24 295 / 0.25)",
        }}
        whileInView={{ scale: [0.8, 1.05, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Sparkles className="w-3 h-3" />
        {label}
      </motion.span>
      <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">{title}</h2>
      <div className="section-title-line mx-auto" />
      {subtitle && <p className="mt-5 text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">{subtitle}</p>}
    </motion.div>
  )
}

export { SectionHeading }

export function About({ data }: { data?: AboutData }) {
  const bio = data?.bio || "Hello! I'm Shahriar Alif, a passionate Full-Stack Web Developer with a strong focus on creating dynamic, intuitive, and modern web applications. My journey in web development started with a simple curiosity, which quickly transformed into a deep obsession with crafting pixel-perfect UI designs.\n\nI thrive in the intersection of design and engineering. My goal is to always build products that provide a seamless, performant, and accessible experience. Whether I'm designing a database schema, building an API, or animating a frontend component, I put 100% effort into every detail.\n\nWhen I'm not coding, you'll probably find me exploring new technologies, contributing to open-source, or reading about the latest trends in UI/UX design."

  const cards = [
    {
      icon: <Laptop className="h-6 w-6" />,
      title: data?.card1Title || "Frontend Development",
      desc: data?.card1Desc || "Building responsive and interactive user interfaces using React and Next.js.",
      color: "oklch(0.55 0.24 295)",
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: data?.card2Title || "Backend Development",
      desc: data?.card2Desc || "Developing robust APIs and database structures with Node.js and Prisma.",
      color: "oklch(0.65 0.2 180)",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: data?.card3Title || "Performance Optimization",
      desc: data?.card3Desc || "Ensuring lightning-fast load times and smooth animations for a premium feel.",
      color: "oklch(0.7 0.2 340)",
    },
  ]

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.55 0.24 295 / 0.06), transparent)",
        }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <SectionHeading label="Get to Know Me" title="About Me" />

        <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-5 text-muted-foreground leading-relaxed md:text-lg"
          >
            {bio.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                {i === 0 && paragraph.includes("Shahriar Alif") ? (
                  <>
                    {paragraph.split("Shahriar Alif")[0]}
                    <strong className="font-bold" style={{ color: "oklch(0.45 0.22 295)" }}>Shahriar Alif</strong>
                    {paragraph.split("Shahriar Alif")[1]}
                  </>
                ) : paragraph}
              </motion.p>
            ))}

            {/* Stats row */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {[
                { value: "3+",  label: "Years Exp." },
                { value: "20+", label: "Projects" },
                { value: "10+", label: "Clients" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-2xl"
                  style={{
                    background: "oklch(0.55 0.24 295 / 0.06)",
                    border: "1px solid oklch(0.55 0.24 295 / 0.15)",
                  }}
                >
                  <div className="text-3xl font-black text-gradient">{value}</div>
                  <div className="text-xs text-muted-foreground font-semibold mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Cards */}
          <div className="grid gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex gap-5 p-6 rounded-2xl border transition-all group card-hover cursor-default"
                style={{
                  background: "oklch(from var(--card) l c h / 80%)",
                  borderColor: "oklch(from var(--border) l c h)",
                  backdropFilter: "blur(10px)",
                }}
                whileHover={{
                  borderColor: card.color + "50",
                  background: card.color + "08",
                }}
              >
                <motion.div
                  className="flex-shrink-0 mt-1 p-3 rounded-xl"
                  style={{
                    background: card.color + "18",
                    color: card.color,
                    border: `1px solid ${card.color}30`,
                  }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {card.icon}
                </motion.div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
