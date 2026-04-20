"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home, Save } from "lucide-react"
import { getHeroData, updateHeroData } from "./actions"
import { toast } from "sonner"

export default function HomeAdminPage() {
  const [welcomeText, setWelcomeText] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [avatarText, setAvatarText] = useState("")
  const [avatarSubtext, setAvatarSubtext] = useState("")
  const [avatarImage, setAvatarImage] = useState("")
  const [badge1, setBadge1] = useState("React")
  const [badge2, setBadge2] = useState("Next.js")
  const [badge3, setBadge3] = useState("Node.js")
  const [showBadges, setShowBadges] = useState(true)
  
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getHeroData().then((data) => {
      if (data) {
        setWelcomeText(data.welcomeText || "")
        setName(data.name || "")
        setRole(data.role || "")
        setDescription(data.description || "")
        setAvatarText(data.avatarText || "")
        setAvatarSubtext(data.avatarSubtext || "")
        setAvatarImage(data.avatarImage || "")
        setBadge1(data.badge1 || "React")
        setBadge2(data.badge2 || "Next.js")
        setBadge3(data.badge3 || "Node.js")
        setShowBadges(data.showBadges ?? true)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append("welcomeText", welcomeText)
    formData.append("name", name)
    formData.append("role", role)
    formData.append("description", description)
    formData.append("avatarText", avatarText)
    formData.append("avatarSubtext", avatarSubtext)
    formData.append("avatarImage", avatarImage || "")
    formData.append("badge1", badge1)
    formData.append("badge2", badge2)
    formData.append("badge3", badge3)
    formData.append("showBadges", String(showBadges))

    try {
      const res = await updateHeroData(formData)
      if (res?.success) {
        toast.success("Home section updated successfully!")
      } else {
        toast.error(res?.error || "Failed to update")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
        <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm transition-all flex flex-col">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Home className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Home Section</h1>
              <p className="text-sm text-muted-foreground font-medium">Manage your hero section content and brand intro.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Welcome Badge Text</label>
                <input 
                  type="text" 
                  value={welcomeText} 
                  onChange={e => setWelcomeText(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                  placeholder="Write welcome badge text here"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Your Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                  placeholder="Write your name here"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Professional Role</label>
              <input 
                type="text" 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                placeholder="Write your professional role here"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Hero Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full h-32 bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all resize-none"
                placeholder="Write your hero description here"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Avatar Text (Initials)</label>
                <input 
                  type="text" 
                  value={avatarText} 
                  onChange={e => setAvatarText(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                  placeholder="Write your initials here (e.g. SA)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Avatar Subtext</label>
                <input 
                  type="text" 
                  value={avatarSubtext} 
                  onChange={e => setAvatarSubtext(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                  placeholder="Write avatar subtext here"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Avatar Image (Optional URL - Overrides Initials)</label>
              <input 
                type="text" 
                value={avatarImage || ""} 
                onChange={e => setAvatarImage(e.target.value)} 
                className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                placeholder="Write avatar image URL here"
              />
              <p className="text-xs text-muted-foreground mt-1 px-1">If left empty, the initials above will be displayed.</p>
            </div>

            <div className="pt-6 border-t border-border/50 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Avatar Skill Badges</h3>
                  <p className="text-xs text-muted-foreground">Floating text pills around your avatar (React, Next.js, etc.)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBadges(!showBadges)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showBadges ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showBadges ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {showBadges && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Badge 1</label>
                    <input 
                      type="text" 
                      value={badge1} 
                      onChange={e => setBadge1(e.target.value)} 
                      className="w-full h-10 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="e.g. React"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Badge 2</label>
                    <input 
                      type="text" 
                      value={badge2} 
                      onChange={e => setBadge2(e.target.value)} 
                      className="w-full h-10 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="e.g. Next.js"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Badge 3</label>
                    <input 
                      type="text" 
                      value={badge3} 
                      onChange={e => setBadge3(e.target.value)} 
                      className="w-full h-10 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="e.g. Node.js"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 text-base rounded-xl font-bold mt-4 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
    </div>
  )
}
