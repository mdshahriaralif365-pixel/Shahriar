"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Trash2, Wrench } from "lucide-react"
import Link from "next/link"
import { deleteSkill, addSkill, getSkills } from "./actions"
import { ConfirmDialog } from "@/components/ui/alert-custom"

interface SkillItem {
  id: string
  name: string
  category: string
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const data = await getSkills()
      setSkills(data as SkillItem[] || [])
    } catch {
      setError("Failed to load skills")
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
      const res = await addSkill(formData)
      if (res?.success) {
        setSuccess("Skill added successfully!")
        form.reset()
        await fetchSkills()
      } else {
        setError(res?.error || "Failed to add skill")
      }
    } catch {
      setError("An error occurred")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSkill(id)
      if (res?.success) {
        setSuccess("Skill deleted")
        fetchSkills()
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
            <h1 className="text-3xl font-bold text-foreground">Manage Skills</h1>
          </div>
        </header>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>}

        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Skill</h2>
          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Name</label>
              <input name="name" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write skill name here" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <input 
                name="category" 
                required 
                className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 font-bold focus:outline-none focus:border-primary transition-all" 
                placeholder="Write category here (e.g. Frontend, Tools)" 
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Skill
              </Button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Skills</h2>
          {isLoading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : skills.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed text-center text-muted-foreground">
              No skills added yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map(skill => (
                <div key={skill.id} className="bg-background p-4 rounded-2xl border border-border/50 shadow-sm flex justify-between items-center group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{skill.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{skill.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: true, id: skill.id })}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
        title="Remove Skill?"
        description="Are you sure you want to remove this skill from your tech stack? This info is visible on your public portfolio."
        confirmText="Yes, Remove"
        type="danger"
      />
    </div>
  )
}
