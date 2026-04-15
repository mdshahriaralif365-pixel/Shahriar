"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar } from "lucide-react"
import { SectionHeading } from "./about"

const MOCK_EXPERIENCE = [
  {
    id: "1",
    company: "Tech Solutions Inc.",
    role: "Senior Full-Stack Developer",
    startDate: "Jan 2022",
    endDate: "Present",
    description: "Leading the frontend team to build highly scalable React applications. Improved site performance by 40% and mentored junior developers.",
  },
  {
    id: "2",
    company: "Creative Web Agency",
    role: "Web Developer",
    startDate: "Mar 2019",
    endDate: "Dec 2021",
    description: "Developed and maintained full-stack web applications using Next.js and Node.js. Collaborated with UI/UX designers to bring mockups to life.",
  },
]

interface ExperienceData {
  id: string; company: string; role: string
  startDate: string; endDate: string | null; description: string
}

const expColors = ["oklch(0.55 0.24 295)", "oklch(0.65 0.2 180)", "oklch(0.7 0.2 340)"]

export function Experience({ data }: { data?: ExperienceData[] }) {
  const experiences = data && data.length > 0 ? data : MOCK_EXPERIENCE

  return (
    <section id="experience" className="py-28 relative overflow-hidden">
      {/* Radial bg */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 80% 50%, oklch(0.65 0.2 180 / 0.06), transparent)",
        }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <SectionHeading label="Career Journey" title="Work Experience" />

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline axis */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px md:left-1/2 md:-translate-x-1/2"
            style={{ background: "linear-gradient(to bottom, transparent, oklch(0.55 0.24 295 / 0.4) 20%, oklch(0.65 0.2 180 / 0.4) 80%, transparent)" }}
          />

          <div className="space-y-10">
            {experiences.map((exp, idx) => {
              const color = expColors[idx % expColors.length]
              const isEven = idx % 2 === 0

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative flex items-start md:items-center justify-start md:justify-normal"
                >
                  {/* Center icon */}
                  <motion.div
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl"
                    style={{ background: color, boxShadow: `0 0 20px ${color}60` }}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Briefcase className="w-5 h-5" />
                  </motion.div>

                  {/* Card — alternating sides on desktop */}
                  <div className={`w-full pl-16 md:pl-0 md:w-[45%] ${isEven ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`}>
                    <motion.div
                      className="p-6 rounded-3xl border transition-all group card-hover"
                      style={{ background: "var(--card)", borderColor: "var(--border)" }}
                      whileHover={{ borderColor: color + "50" }}
                    >
                      {/* Date badge */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <Calendar className="w-3.5 h-3.5" style={{ color }} />
                        <span
                          className="text-xs font-bold rounded-full px-3 py-0.5"
                          style={{ background: color + "15", color, border: `1px solid ${color}30` }}
                        >
                          {exp.startDate} — {exp.endDate || "Present"}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <h4
                        className="font-bold text-sm uppercase tracking-wider mb-4"
                        style={{ color }}
                      >
                        {exp.company}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
