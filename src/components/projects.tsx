"use client"

import { motion } from "framer-motion"
import { ExternalLink, FolderKanban } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

// এই ডেটাগুলো পরে ডাটাবেস থেকে ডাইনামিকভাবে আসবে (ধাপ ৯-এ)
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-scale e-commerce application with secure authentication, payment gateway integration, and a dedicated admin dashboard.",
    image: "bg-blue-500/20",
    techStack: ["Next.js", "TypeScript", "Prisma", "Stripe", "Tailwind CSS"],
    liveDemo: "https://example.com",
    github: "https://github.com",
  },
  {
    id: "2",
    title: "Project Management Tool",
    description: "A Kanban-style project management app allowing teams to collaborate in real-time with drag-and-drop features.",
    image: "bg-purple-500/20",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Redux"],
    liveDemo: "https://example.com",
    github: "https://github.com",
  },
  {
    id: "3",
    title: "AI Image Generator",
    description: "An AI-powered application that generates images from text prompts using OpenAI's DALL-E model.",
    image: "bg-emerald-500/20",
    techStack: ["Next.js", "OpenAI API", "Tailwind CSS", "Zustand"],
    liveDemo: "https://example.com",
    github: "https://github.com",
  }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Projects({ data }: { data?: any[] }) {
  const projects = data && data.length > 0 ? data : MOCK_PROJECTS;

  return (
    <section id="projects" className="py-24 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">Featured Projects</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Some of my recent works. Each project is built from scratch with a focus on great user experience and scalable architecture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="group flex flex-col bg-background rounded-3xl border border-border/50 overflow-hidden hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:border-primary/50 transition-all duration-500"
            >
              {/* Project Image Placeholder */}
              <div className={`relative h-56 w-full ${project.image} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                <FolderKanban className="h-20 w-20 text-foreground/30 group-hover:scale-110 transition-transform duration-500 relative z-0" />
                
                {/* Overlay Links on Hover */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center gap-4">
                  {project.liveDemo && (
                    <Button asChild size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href={project.liveDemo} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                      </Link>
                    </Button>
                  )}
                  {project.github && (
                    <Button asChild size="sm" variant="secondary" className="rounded-full">
                      <Link href={project.github} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.techStack.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-xs font-medium rounded-full border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
