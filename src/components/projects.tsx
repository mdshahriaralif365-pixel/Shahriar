"use client"

import { motion } from "framer-motion"
import { ExternalLink, FolderKanban } from "lucide-react"
import { GithubIcon } from "@/components/icons"
import Link from "next/link"
import { Button } from "./ui/button"
import { SectionHeading } from "./about"
import Image from "next/image"

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
  },
]

interface ProjectData {
  id: string; title: string; description: string; image: string
  techStack: string[]; liveDemo: string | null; github: string | null
}

const cardColors = [
  "oklch(0.55 0.24 295)",
  "oklch(0.65 0.2 180)",
  "oklch(0.7 0.2 340)",
]

export function Projects({ data }: { data?: ProjectData[] }) {
  const projects = data && data.length > 0 ? data : MOCK_PROJECTS
  const displayProjects = projects.map((p, i) => ({
    ...p,
    accentColor: cardColors[i % cardColors.length],
    techStack: typeof p.techStack === "string"
      ? (p.techStack as string).split(",").map((t: string) => t.trim())
      : p.techStack,
  }))

  return (
    <section id="projects" className="py-28 relative overflow-hidden">
      {/* Bg accent */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 20% 50%, oklch(0.55 0.24 295 / 0.05), transparent)",
        }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <SectionHeading
          label="My Work"
          title="Featured Projects"
          subtitle="Each project is crafted from scratch with attention to detail, performance, and user experience."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group flex flex-col rounded-3xl overflow-hidden border transition-all duration-500 card-hover"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
              whileHover={{ borderColor: project.accentColor + "50" }}
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden flex items-center justify-center">
                {project.image && (
                  project.image.startsWith("data:image") ||
                  project.image.startsWith("http") ||
                  project.image.startsWith("/")
                ) ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${project.accentColor}20, ${project.accentColor}08)` }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FolderKanban className="h-16 w-16 opacity-30" style={{ color: project.accentColor }} />
                    </motion.div>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent z-10" />

                {/* Hover overlay with buttons */}
                <motion.div
                  className="absolute inset-0 z-20 flex items-center justify-center gap-3"
                  style={{ backdropFilter: "blur(4px)", background: "oklch(0 0 0 / 50%)" }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {project.liveDemo && (
                    <motion.div initial={{ y: 10, opacity: 0 }} whileHover={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
                      <Button
                        asChild
                        size="sm"
                        className="rounded-xl font-bold shadow-xl"
                        style={{ background: project.accentColor, color: "#fff" }}
                      >
                        <Link href={project.liveDemo} target="_blank">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live Demo
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                  {project.github && (
                    <motion.div initial={{ y: 10, opacity: 0 }} whileHover={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                      <Button asChild size="sm" variant="secondary" className="rounded-xl font-bold">
                        <Link href={project.github} target="_blank">
                          <GithubIcon className="mr-1.5 h-3.5 w-3.5" /> Code
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Number badge */}
                <div
                  className="absolute top-4 left-4 z-30 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white"
                  style={{ background: project.accentColor }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3
                  className="text-xl font-bold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary"
                >
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 flex-grow leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {(Array.isArray(project.techStack) ? project.techStack : []).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg"
                      style={{
                        background: project.accentColor + "15",
                        color: project.accentColor,
                        border: `1px solid ${project.accentColor}30`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
