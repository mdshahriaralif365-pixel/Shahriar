"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Trash2, Briefcase } from "lucide-react"
import Link from "next/link"
import { deleteExperience, addExperience, getExperiences } from "./actions"
import { ConfirmDialog } from "@/components/ui/alert-custom"

interface ExperienceItem {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string
}

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences()
      setExperiences(data as ExperienceItem[] || [])
    } catch {
      setError("Failed to load experiences")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const res = await addExperience(formData)
      if (res?.success) {
        setSuccess("Experience added successfully!")
        form.reset()
        await fetchExperiences()
      } else {
        setError(res?.error || "Failed to add experience")
      }
    } catch {
      setError("An error occurred while adding experience")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteExperience(id)
      if (res?.success) {
        setSuccess("Experience deleted")
        fetchExperiences()
      } else {
        setError(res?.error || "Failed to delete")
      }
    } catch {
      setError("An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-sm text-primary flex items-center gap-1 hover:underline mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Manage Experience</h1>
          </div>
        </header>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>}

        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Experience</h2>
          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input name="company" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write company name here" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Role</label>
              <input name="role" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write your role here" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <input name="startDate" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write start date here (e.g. Jan 2022)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date (Leave blank for Present)</label>
              <input name="endDate" className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write end date here or leave blank for Present" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 h-32" placeholder="Write your responsibilities and achievements here" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="px-8 py-2 rounded-xl font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Experience
              </Button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Career History</h2>
          {isLoading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : experiences.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed text-center text-muted-foreground">
              No experiences added yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {experiences.map(exp => (
                <div key={exp.id} className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm transition-all hover:border-primary/30 group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                        <p className="text-sm text-primary font-medium">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mb-3">{exp.startDate} - {exp.endDate || 'Present'}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setDeleteConfirm({ isOpen: true, id: exp.id })}
                      className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Delete Experience?"
        description="Are you sure you want to remove this role from your resume? This action cannot be reversed."
        confirmText="Yes, Delete"
        type="danger"
      />
    </div>
  )
}
