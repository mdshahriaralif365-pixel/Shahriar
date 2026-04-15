import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export default async function SetupAdmin() {
  const userCount = await prisma.user.count()
  
  // If user already exists, don't allow setup
  if (userCount > 0) {
    redirect("/admin/login")
  }

  async function createAdmin(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })
    
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 p-4">
      <div className="max-w-md w-full bg-background p-8 rounded-3xl border border-border shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Initial Admin Setup</h1>
        <p className="text-muted-foreground text-sm mb-6">Create the first administrative account to manage your portfolio.</p>
        
        <form action={createAdmin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input name="name" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write your full name here" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input name="email" type="email" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write your admin email here" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input name="password" type="password" required className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/20" placeholder="Write a strong password here" />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  )
}
