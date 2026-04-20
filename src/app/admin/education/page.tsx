"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Trash2, GraduationCap } from "lucide-react"
import Link from "next/link"
import { deleteEducation, addEducation, getEducations } from "./actions"
import { ConfirmDialog } from "@/components/ui/alert-custom"

interface EducationItem {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string | null
  description: string | null
}

export default function EducationAdmin() {
  const [educations, setEducations] = useState<EducationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    try {
      const data = await getEducations()
      setEducations(data as EducationItem[] || [])
    } catch {
      setError("Failed to load education records")
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
      const res = await addEducation(formData)
      if (res?.success) {
        setSuccess("Education added successfully!")
        form.reset()
        await fetchEducations()
      } else {
        setError(res?.error || "Failed to add education")
      }
    } catch {
      setError("An error occurred")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteEducation(id)
      if (res?.success) {
        setSuccess("Education deleted")
        fetchEducations()
      } else {
        setError(res?.error || "Failed to delete")
      }
    } catch {
      setError("An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-sm text-primary flex items-center gap-1 hover:underline mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Manage Education</h1>
          </div>
        </header>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>}

        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Education</h2>
          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Institution / University</label>
              <input name="institution" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Harvard University" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Degree / Field</label>
              <input name="degree" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="BS in Computer Science" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <input name="startDate" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="2018" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date (Optional)</label>
              <input name="endDate" className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="2022 or Present" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <textarea name="description" rows={3} className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 resize-none" placeholder="Briefly describe your focus or achievements..." />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="px-8 py-2 rounded-xl font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Education
              </Button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Educational Background</h2>
          {isLoading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : educations.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed text-center text-muted-foreground">
              No education records added yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {educations.map(edu => (
                <div key={edu.id} className="bg-background p-5 rounded-2xl border border-border/50 shadow-sm flex justify-between items-center group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{edu.degree}</h3>
                      <p className="text-sm text-primary font-medium">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.startDate} — {edu.endDate || "Present"}</p>
                      {edu.description && <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>}
                    </div>
                  </div>
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: true, id: edu.id })}
                    className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
        title="Remove Education?"
        description="Are you sure you want to remove this academic record? This will be updated on your public profile instantly."
        confirmText="Yes, Remove"
        type="danger"
      />
    </div>
  )
}
