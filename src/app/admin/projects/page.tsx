"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, FolderKanban } from "lucide-react"
import { deleteProject, addProject, getProjects } from "./actions"
import { ConfirmDialog } from "@/components/ui/alert-custom"
import { toast } from "sonner"

interface ProjectItem {
  id: string
  title: string
  description: string
  image: string
  techStack: string
  liveDemo: string | null
  github: string | null
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  
  // Custom Alert State
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data as ProjectItem[] || [])
    } catch {
      toast.error("Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image size should be less than 1MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    if (selectedImage) {
      formData.set("image", selectedImage)
    }
    
    try {
      const res = await addProject(formData)
      if (res?.success) {
        toast.success("Project created successfully!")
        form.reset()
        setSelectedImage("")
        await fetchProjects()
      } else {
        toast.error(res?.error || "Failed to add project")
      }
    } catch (err) {
      console.error("Add project error:", err)
      toast.error("An error occurred while adding project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const previousProjects = [...projects]
    setProjects(projects.filter(p => p.id !== id))

    try {
      const res = await deleteProject(id)
      if (res?.success) {
        toast.success("Project deleted successfully")
        await fetchProjects()
      } else {
        setProjects(previousProjects)
        toast.error(res?.error || "Failed to delete")
      }
    } catch {
      setProjects(previousProjects)
      toast.error("An error occurred while deleting project")
    }
  }

  return (
    <div className="pb-20 max-w-5xl">
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 ml-1">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Portfolio Projects</h1>
            <p className="text-muted-foreground font-medium mt-1">Showcase your best work and manage project details.</p>
          </div>
        </header>

        <section className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm mb-12">
          <h2 className="text-xl font-bold mb-6">Add New Project</h2>
          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase px-1">Project Title</label>
              <input name="title" required className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-medium" placeholder="Write project title here" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase px-1">Tech Stack</label>
              <input name="techStack" required className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-medium" placeholder="Write tech stack here (e.g. React, Node.js)" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase px-1">Description</label>
              <textarea name="description" required className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all h-24 resize-none" placeholder="Write project description here" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase px-1">Project Image</label>
              <div className="flex items-center gap-4 p-4 bg-secondary/10 border border-border/50 rounded-2xl">
                <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedImage ? (
                    <Image src={selectedImage} alt="Preview" width={400} height={400} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <FolderKanban className="w-8 h-8 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" id="p-img" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <label htmlFor="p-img" className="text-sm text-primary font-bold cursor-pointer hover:underline">Upload Image File</label>
                  <p className="text-[10px] text-muted-foreground mt-1">1:1 or 16:9 ratio recommended. Max 1MB.</p>
                </div>
              </div>
              <input 
                name="image" 
                value={selectedImage || ""}
                onChange={(e) => setSelectedImage(e.target.value)}
                className="w-full h-10 mt-2 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-xs" 
                placeholder="Paste image URL here" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Live Demo</label>
                <input name="liveDemo" className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm" placeholder="Write live demo URL here" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">GitHub URL</label>
                <input name="github" className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm" placeholder="Write GitHub repo URL here" />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end items-center gap-4 pt-4 border-t border-border/50">
              <Button type="submit" disabled={isSubmitting} className="h-12 px-10 rounded-xl font-bold">
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </section>

        <div className="grid gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Existing Projects <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{projects.length}</span>
          </h2>
          {isLoading ? (
            <div className="p-10 text-center animate-pulse text-muted-foreground">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="bg-background p-16 rounded-[2.5rem] border border-dashed border-border flex flex-col items-center text-center">
              <FolderKanban className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">No projects found. Add your first masterpiece above!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-background p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col h-full">
                  <div className="aspect-video w-full rounded-2xl bg-secondary/30 mb-6 overflow-hidden relative border border-border/50">
                    {project.image && !project.image.startsWith("bg-") ? (
                      <Image src={project.image} alt={project.title} width={600} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    ) : (
                      <div className={`w-full h-full ${project.image || 'bg-primary/10'} flex items-center justify-center`}>
                        <FolderKanban className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => setDeleteConfirm({ isOpen: true, id: project.id })}
                        className="p-3 bg-background/80 backdrop-blur-md text-destructive rounded-xl hover:bg-destructive hover:text-white transition-all shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto mb-6">
                      {project.techStack.split(",").map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      {project.liveDemo && (
                        <a href={project.liveDemo} target="_blank" className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-4 h-9 rounded-lg hover:bg-primary hover:text-white transition-all">
                          <ExternalLink className="w-3.5 h-3.5" /> LIVE DEMO
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary/50 px-4 h-9 rounded-lg hover:bg-foreground hover:text-background transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                          CODE
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Delete Project?"
        description="This action cannot be undone. This project and all its data will be permanently removed from your portfolio."
        confirmText="Yes, Delete"
        type="danger"
      />
    </div>
  )
}
