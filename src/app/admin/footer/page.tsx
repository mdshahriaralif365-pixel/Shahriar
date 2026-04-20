"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Layout } from "lucide-react"
import Link from "next/link"

export default function FooterAdminPage() {
  const [copyrightText, setCopyrightText] = useState("All rights reserved © {year}.")
  const [builtWithText, setBuiltWithText] = useState("Built with ❤️ by")
  const [creditName, setCreditName] = useState("Shahriar Alif")
  const [creditLink, setCreditLink] = useState("/")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/footer")
      const data = await res.json()
      if (data && !data.error) {
        setCopyrightText(data.copyrightText || "All rights reserved © {year}.")
        setBuiltWithText(data.builtWithText || "Built with ❤️ by")
        setCreditName(data.creditName || "Shahriar Alif")
        setCreditLink(data.creditLink || "/")
      }
    } catch {
      setError("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          copyrightText,
          builtWithText,
          creditName,
          creditLink,
        }),
      })

      if (res.ok) {
        setSuccess("Footer settings updated successfully")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to update settings")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="w-10 h-10 bg-background rounded-full flex items-center justify-center border border-border/50 hover:bg-secondary transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Layout className="w-6 h-6 text-primary" />
                Footer Settings
              </h1>
              <p className="text-sm text-muted-foreground">Manage your website&apos;s footer content and credits</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
          </Button>
        </header>

        {error && <div className="bg-destructive/10 text-destructive p-4 rounded-2xl mb-6 text-center font-medium border border-destructive/20">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-600 p-4 rounded-2xl mb-6 text-center font-medium border border-green-500/20">{success}</div>}

        <div className="grid gap-8">
          <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wider">Copyright Text</label>
                <input 
                  type="text" 
                  value={copyrightText} 
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-medium"
                  placeholder="Write copyright text here"
                />
                <p className="mt-1 text-[10px] text-muted-foreground italic">Use {"&quot;year&quot;"} to automatically display the current year.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                  <label className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wider">&quot;Built With&quot; Text</label>
                  <input 
                    type="text" 
                    value={builtWithText} 
                    onChange={(e) => setBuiltWithText(e.target.value)}
                    className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                    placeholder="Write built-with text here"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wider">Credit Name (Owner)</label>
                  <input 
                    type="text" 
                    value={creditName} 
                    onChange={(e) => setCreditName(e.target.value)}
                    className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-bold"
                    placeholder="Write credit name here"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wider">Credit/Profile Link</label>
                <input 
                  type="text" 
                  value={creditLink} 
                  onChange={(e) => setCreditLink(e.target.value)}
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                  placeholder="Write credit/profile link here"
                />
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm">
            <h3 className="text-lg font-bold mb-4 opacity-50">Live Preview</h3>
            <footer className="border-t border-border/40 py-8 bg-secondary/10 rounded-2xl">
              <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 overflow-hidden">
                <p className="text-center text-sm leading-loose text-muted-foreground">
                  {builtWithText}{" "}
                  <span className="font-semibold text-primary underline underline-offset-4 cursor-pointer">
                    {creditName}
                  </span>
                  . {copyrightText.replace("{year}", new Date().getFullYear().toString())}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
