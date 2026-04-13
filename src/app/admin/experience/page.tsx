import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Briefcase } from "lucide-react"
import { deleteExperience, addExperience } from "./actions"

export default async function ExperienceAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" }
  });

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

        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Experience</h2>
          <form action={addExperience} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input name="company" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Tech Co." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role / Position</label>
              <input name="role" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Frontend Developer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <input name="startDate" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Jan 2022" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date (or 'Present')</label>
              <input name="endDate" className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Dec 2023" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Key Responsibilities (JSON or text)</label>
              <textarea name="description" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 h-24" placeholder="Built scalable UI components..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order (Lowest first)</label>
              <input name="order" type="number" defaultValue="0" className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-primary text-primary-foreground px-8 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Experience History</h2>
          {experiences.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed text-center text-muted-foreground">
              No experiences recorded yet.
            </div>
          ) : (
            experiences.map(exp => (
              <div key={exp.id} className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{exp.role} @ {exp.company}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{exp.startDate} - {exp.endDate || "Present"}</p>
                    <p className="text-sm text-muted-foreground max-w-2xl">{exp.description}</p>
                  </div>
                </div>
                <form action={async () => { "use server"; await deleteExperience(exp.id); }}>
                  <button type="submit" className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
