"use client"

import { motion } from "framer-motion"
import { Code2, Laptop, Rocket } from "lucide-react"

export function About() {
  const cards = [
    {
      icon: <Laptop className="h-6 w-6 text-primary" />,
      title: "Frontend Development",
      description: "Building responsive and interactive user interfaces using React and Next.js.",
    },
    {
      icon: <Code2 className="h-6 w-6 text-primary" />,
      title: "Backend Development",
      description: "Developing robust APIs and database structures with Node.js and Prisma.",
    },
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Performance Optimization",
      description: "Ensuring lightning-fast load times and smooth animations for a premium feel.",
    },
  ]

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">About Me</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-muted-foreground leading-relaxed md:text-lg"
          >
            <p>
              Hello! I&apos;m <strong className="text-foreground">Shahriar Alif</strong>, a passionate Full-Stack Web Developer with a strong focus on creating dynamic, intuitive, and modern web applications. My journey in web development started with a simple curiosity, which quickly transformed into a deep obsession with crafting pixel-perfect UI designs.
            </p>
            <p>
              I thrive in the intersection of design and engineering. My goal is to always build products that provide a seamless, performant, and accessible experience. Whether I&apos;m designing a database schema, building an API, or animating a frontend component, I put 100% effort into every detail.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll probably find me exploring new technologies, contributing to open-source, or reading about the latest trends in UI/UX design.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-5 p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 hover:border-primary/30 transition-all group"
              >
                <div className="mt-1 bg-background p-3 rounded-full h-fit flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
