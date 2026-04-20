"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "./about"

const defaultSkillCategories = [
  {
    title: "Frontend Development",
    color: "oklch(0.55 0.24 295)",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/UI", "Redux"],
  },
  {
    title: "Backend & Database",
    color: "oklch(0.65 0.2 180)",
    skills: ["Node.js", "Express", "Prisma ORM", "SQLite", "PostgreSQL", "NextAuth.js", "REST APIs"],
  },
  {
    title: "Tools & Workflow",
    color: "oklch(0.7 0.2 340)",
    skills: ["Git", "GitHub", "Vercel", "Figma", "Zod", "React Hook Form", "VS Code"],
  },
]

interface SkillsProps {
  data?: { title: string; skills: string[] }[]
}

export function Skills({ data }: SkillsProps) {
  const rawCategories = data || defaultSkillCategories
  const displayCategories = rawCategories.map((cat, i) => ({
    ...cat,
    color: (cat as { color?: string }).color || defaultSkillCategories[i % defaultSkillCategories.length].color,
  }))

  return (
    <section
      id="skills"
      className="py-28 relative overflow-hidden"
      style={{ background: "oklch(from var(--background) calc(l - 0.01) c h)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(oklch(0.55 0.24 295) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <SectionHeading
          label="Tech Stack"
          title="My Skills"
          subtitle="A comprehensive list of technologies, tools, and frameworks I use to build scalable modern applications."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-7 rounded-3xl border transition-all duration-500 group card-hover"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
              whileHover={{ borderColor: (category as { color: string }).color + "50" }}
            >
              {/* Category header */}
              <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-3">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: (category as { color: string }).color, boxShadow: `0 0 10px ${(category as { color: string }).color}80` }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: idx }}
                />
                {category.title}
              </h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-semibold rounded-xl cursor-default transition-all duration-200"
                    style={{
                      background: (category as { color: string }).color + "12",
                      color: (category as { color: string }).color,
                      border: `1px solid ${(category as { color: string }).color}28`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + si * 0.04 }}
                    whileHover={{
                      scale: 1.08,
                      y: -2,
                      background: (category as { color: string }).color,
                      color: "#fff",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
