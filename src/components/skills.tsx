"use client"

import { motion } from "framer-motion"

const defaultSkillCategories = [
  {
    title: "Frontend Development",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/UI", "Redux"]
  },
  {
    title: "Backend & Database",
    skills: ["Node.js", "Express", "Prisma ORM", "SQLite", "PostgreSQL", "NextAuth.js", "REST APIs"]
  },
  {
    title: "Tools & Workflow",
    skills: ["Git", "GitHub", "Vercel", "Figma", "Zod", "React Hook Form", "VS Code"]
  }
]

interface SkillsProps {
  data?: {
    title: string;
    skills: string[];
  }[];
}

export function Skills({ data }: SkillsProps) {
  const displayCategories = data || defaultSkillCategories;

  return (
    <section id="skills" className="py-24 relative bg-secondary/10">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">My Skills</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A comprehensive list of the technologies, tools, and frameworks I use on a daily basis to build scalable and modern web applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-background/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_25px_rgba(var(--primary),0.1)] transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 bg-secondary/80 text-secondary-foreground text-sm font-semibold rounded-xl cursor-default hover:bg-primary hover:text-primary-foreground border border-border/40 transition-colors"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
