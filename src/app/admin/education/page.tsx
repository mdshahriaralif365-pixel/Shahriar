import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, GraduationCap } from "lucide-react"
import { deleteEducation, addEducation } from "./actions"

export default async function EducationAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const educations = await prisma.education.findMany();

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

        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Education</h2>
          <form action={addEducation} className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium">Institute</label>
              <input name="institute" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:ring-2 focus:ring-primary/50" placeholder="University of..." />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium">Degree</label>
              <input name="degree" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:ring-2 focus:ring-primary/50" placeholder="B.Sc. in CSE" />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium">Year</label>
              <input name="year" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20 focus:ring-2 focus:ring-primary/50" placeholder="2020 - 2024" />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Record
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Educational Timeline</h2>
          {educations.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed text-center text-muted-foreground">
              No education records found.
            </div>
          ) : (
            educations.map(edu => (
              <div key={edu.id} className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institute} | {edu.year}</p>
                  </div>
                </div>
                <form action={async () => { "use server"; await deleteEducation(edu.id); }}>
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
