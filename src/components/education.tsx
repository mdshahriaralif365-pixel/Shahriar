"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"

const MOCK_EDUCATION = [
  {
    id: "1",
    institute: "University of Technology",
    degree: "B.Sc. in Computer Science & Engineering",
    year: "2015 - 2019",
  },
  {
    id: "2",
    institute: "City College",
    degree: "Higher Secondary Certificate",
    year: "2013 - 2015",
  }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Education({ data }: { data?: any[] }) {
  const educations = data && data.length > 0 ? data : MOCK_EDUCATION;

  return (
    <section id="education" className="py-24 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">Education</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {educations.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="p-8 rounded-3xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 hover:border-primary/20 transition-all flex flex-col items-center text-center group shadow-sm hover:shadow-md"
            >
              <div className="p-4 bg-background rounded-full mb-6 border border-border group-hover:border-primary/50 group-hover:text-primary transition-all shadow-sm">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{edu.degree}</h3>
              <p className="text-muted-foreground font-medium mb-5">{edu.institute}</p>
              <span className="px-4 py-1.5 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full border border-border/50 shadow-sm">
                {edu.year}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
