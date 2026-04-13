import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Layers, Briefcase, GraduationCap, Home, LogOut, Wrench } from "lucide-react"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const sections = [
    { name: "Projects", icon: <Layers className="w-6 h-6" />, href: "/admin/projects", description: "Add or edit portfolio projects" },
    { name: "Experience", icon: <Briefcase className="w-6 h-6" />, href: "/admin/experience", description: "Manage your work experiences" },
    { name: "Education", icon: <GraduationCap className="w-6 h-6" />, href: "/admin/education", description: "Update your educational background" },
    { name: "Skills", icon: <Wrench className="w-6 h-6" />, href: "/admin/skills", description: "Manage your technical skills" },
  ]

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-background p-6 rounded-3xl border border-border/50 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
              A
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {session.user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
              <Home className="w-4 h-4" /> Live Site
            </Link>
            <Link href="/api/auth/signout" className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/20 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </Link>
          </div>
        </header>

        <h2 className="text-xl font-bold mb-6">Manage Content</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map(sec => (
            <Link key={sec.name} href={sec.href} className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col group">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mb-6">
                {sec.icon}
              </div>
              <h3 className="font-bold text-xl mb-2 text-foreground">{sec.name}</h3>
              <p className="text-sm text-muted-foreground">{sec.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
