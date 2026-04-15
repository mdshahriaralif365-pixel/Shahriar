"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar } from "lucide-react"
import { SectionHeading } from "./about"

const DEFAULT_EDUCATION = [
  {
    id: "1",
    degree: "Computer Science & Engineering",
    institution: "Your University Name",
    startDate: "2018",
    endDate: "2022",
    description: "Focused on core algorithms, data structures, and web technologies. Completed several web-based research projects.",
  },
  {
    id: "2",
    degree: "Higher Secondary Certificate",
    institution: "Your College Name",
    startDate: "2016",
    endDate: "2018",
    description: "Specialized in Science group with a focus on Mathematics and Physics.",
  }
]

interface EducationData {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string | null
  description: string
}

const eduColors = ["oklch(0.65 0.2 180)", "oklch(0.55 0.24 295)", "oklch(0.7 0.2 340)"]

export function Education({ data }: { data?: EducationData[] }) {
  const education = data && data.length > 0 ? data : DEFAULT_EDUCATION

  return (
    <section id="education" className="py-28 relative overflow-hidden bg-secondary/5">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 20% 80%, oklch(0.65 0.2 180 / 0.05), transparent)",
        }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <SectionHeading 
          label="Learning Path" 
          title="Education" 
          subtitle="My academic foundation that shaped my analytical and problem-solving skills."
        />

        <div className="max-w-4xl mx-auto grid gap-8">
          {education.map((item, idx) => {
            const color = eduColors[idx % eduColors.length]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative group p-1 rounded-[2rem] transition-all"
              >
                {/* Gradient Border Overlay */}
                <div 
                  className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
                />
                
                <div 
                  className="p-8 rounded-[1.9rem] bg-card border border-border/50 h-full flex flex-col md:flex-row gap-6 md:items-center"
                  style={{ background: "oklch(from var(--card) l c h / 95%)", backdropFilter: "blur(10px)" }}
                >
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: color, color: "#fff", boxShadow: `0 8px 20px ${color}40` }}
                  >
                    <GraduationCap className="w-8 h-8" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{item.degree}</h3>
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit"
                        style={{ background: color + "15", color, border: `1px solid ${color}30` }}
                      >
                        <Calendar className="w-3 h-3" />
                        {item.startDate} — {item.endDate || "Present"}
                      </div>
                    </div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-4 opacity-80" style={{ color }}>{item.institution}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
