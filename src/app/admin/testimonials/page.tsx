"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Trash2, Quote } from "lucide-react"
import Link from "next/link"
import { deleteTestimonial, addTestimonial, getTestimonials } from "./actions"
import { ConfirmDialog } from "@/components/ui/alert-custom"

interface TestimonialItem {
  id: string
  name: string
  position: string
  text: string
  link?: string | null
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials()
      setTestimonials(data as TestimonialItem[] || [])
    } catch {
      setError("Failed to load testimonials")
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
      const res = await addTestimonial(formData)
      if (res?.success) {
        setSuccess("Testimonial added successfully!")
        form.reset()
        await fetchTestimonials()
      } else {
        setError(res?.error || "Failed to add testimonial")
      }
    } catch {
      setError("An error occurred")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteTestimonial(id)
      if (res?.success) {
        setSuccess("Testimonial deleted")
        fetchTestimonials()
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
            <h1 className="text-3xl font-bold text-foreground">Manage Testimonials</h1>
          </div>
        </header>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>}

        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Testimonial</h2>
          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tester Name</label>
              <input name="name" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write full name here" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position / Role</label>
              <input name="position" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write position or role here" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Testimonial Text</label>
              <textarea name="text" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 h-24" placeholder="Write testimonial text here" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Reference Link (e.g. LinkedIn, Website)</label>
              <input name="link" className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write reference link here (e.g. LinkedIn)" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="px-8 py-2 rounded-xl font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Testimonial
              </Button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Current Testimonials</h2>
          {isLoading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : testimonials.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed text-center text-muted-foreground">
              No testimonials added yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {testimonials.map(item => (
                <div key={item.id} className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Quote className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-primary font-medium mb-1">{item.position}</p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-primary underline mb-1">
                            View Reference
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground italic">&quot;{item.text}&quot;</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: true, id: item.id })}
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
        title="Delete Testimonial?"
        description="Are you sure you want to remove this feedback from your portfolio? This action cannot be undone."
        confirmText="Yes, Delete"
        type="danger"
      />
    </div>
  )
}
