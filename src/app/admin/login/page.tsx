"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const res = await signIn("credentials", {
      email, password, redirect: false
    })
    
    if (res?.error) {
      setError("Invalid Email or Password")
      setIsLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none -z-10" />
      
      <div className="max-w-md w-full bg-background p-8 rounded-3xl border border-border/50 shadow-2xl relative z-10">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Admin Login</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">Sign in to manage your portfolio</p>
        
        {error && <div className="bg-destructive/10 text-destructive text-sm font-medium p-3 rounded-lg text-center mb-6">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-foreground">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg rounded-xl mt-4">
            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  )
}
