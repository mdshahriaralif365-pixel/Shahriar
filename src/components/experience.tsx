"use client"

import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"

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
  }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Experience({ data }: { data?: any[] }) {
  const experiences = data && data.length > 0 ? data : MOCK_EXPERIENCE;

  return (
    <section id="experience" className="py-24 relative bg-secondary/10">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">Work Experience</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary/5 before:via-primary/20 before:to-primary/5 rounded-full">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground absolute left-0 md:left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(var(--primary),0.5)] z-10">
                <Briefcase className="w-4 h-4 shadow-sm" />
              </div>
              
              <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-[0_0_25px_rgba(var(--primary),0.08)] hover:border-primary/30 transition-all ml-auto md:ml-0 md:group-odd:ml-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <h3 className="font-bold text-xl text-foreground">{exp.role}</h3>
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full w-fit">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">{exp.company}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
