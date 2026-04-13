import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Wrench } from "lucide-react"
import { deleteSkill, addSkill } from "./actions"

export default async function SkillsAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const skills = await prisma.skill.findMany();

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

        <section className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add New Skill</h2>
          <form action={addSkill} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Name</label>
              <input name="name" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="React, Node.js, etc." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select name="category" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20">
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend & Database">Backend & Database</option>
                <option value="Tools & Workflow">Tools & Workflow</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Skills</h2>
          {skills.length === 0 ? (
            <div className="bg-background p-10 rounded-3xl border border-dashed text-center text-muted-foreground">
              No skills added yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map(skill => (
                <div key={skill.id} className="bg-background p-4 rounded-2xl border border-border/50 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{skill.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{skill.category}</p>
                    </div>
                  </div>
                  <form action={async () => { "use server"; await deleteSkill(skill.id); }}>
                    <button type="submit" className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
