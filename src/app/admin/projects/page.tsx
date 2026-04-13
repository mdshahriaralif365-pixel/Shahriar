import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Pencil, ExternalLink } from "lucide-react"
import { deleteProject, addProject } from "./actions"
import type { Project } from "@prisma/client"

export default async function ProjectsAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-sm text-primary flex items-center gap-1 hover:underline mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="w-5 h-5" /> Add Project
          </button>
        </header>

        {/* Add Project Form (Simplistic for now, in a real app this might be a modal or separate page) */}
        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Project</h2>
          <form action={addProject} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title</label>
              <input name="title" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. My Awesome App" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack (comma separated)</label>
              <input name="techStack" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Next.js, Tailwind, Prisma" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 h-24" placeholder="Briefly describe the project..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Live Demo URL</label>
              <input name="liveDemo" className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub URL</label>
              <input name="github" className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://github.com/..." />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
                Create Project
              </button>
            </div>
          </form>
        </section>

        {/* Projects List */}
        <div className="grid gap-6">
          <h2 className="text-xl font-bold">Existing Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed border-border text-center text-muted-foreground">
              No projects found. Add your first project above!
            </div>
          ) : (
            projects.map((project: Project) => (
              <div key={project.id} className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary/30 transition-all">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.split(",").map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-md border border-border/30">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    {project.liveDemo && (
                        <a href={project.liveDemo} target="_blank" className="p-2 bg-secondary/50 rounded-lg hover:text-primary transition-colors">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    {project.github && (
                        <a href={project.github} target="_blank" className="p-2 bg-secondary/50 rounded-lg hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        </a>
                    )}
                  <button className="p-2 bg-secondary/50 rounded-lg hover:text-primary transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <form action={async () => { "use server"; await deleteProject(project.id); }}>
                    <button type="submit" className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
