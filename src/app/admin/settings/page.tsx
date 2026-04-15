"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { KeyRound, User, Mail, ShieldCheck, Eye, ImageIcon, Globe, ChevronRight } from "lucide-react"
import Link from "next/link"

import Image from "next/image"
import { getSectionVisibility, updateSectionVisibility } from "./visibility-actions"
import { getSiteSettings, updateSiteSettings } from "./site-actions"
import { toast } from "sonner"

interface VisibilityState {
  showAbout: boolean
  showProject: boolean
  showExp: boolean
  showEdu: boolean
  showSkill: boolean
  showTesti: boolean
  showContact: boolean
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession()
  
  // Profile state
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [passwordForProfile, setPasswordForProfile] = useState("")
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [visibility, setVisibility] = useState<VisibilityState>({
    showAbout: true,
    showProject: true,
    showExp: true,
    showEdu: true,
    showSkill: true,
    showTesti: true,
    showContact: true
  })

  // Site Identity state
  const [siteName, setSiteName] = useState("")
  const [siteRole, setSiteRole] = useState("")
  const [favicon, setFavicon] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "")
      setName(session.user.name || "")
    }
    
    // Load visibility settings
    getSectionVisibility().then(data => {
      if (data) setVisibility(data as VisibilityState)
    })

    // Load site settings
    getSiteSettings().then(data => {
      if (data) {
        setSiteName(data.siteName || "")
        setSiteRole(data.siteRole || "")
        setFavicon(data.favicon || null)
      }
    })
  }, [session])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/update-profile", {
        method: "POST",
        body: JSON.stringify({ newEmail: email, newName: name, password: passwordForProfile }),
      })
      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || "Profile updated successfully!")
        setPasswordForProfile("")
        if (updateSession) updateSession()
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match")
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()

      if (res.ok) {
        toast.success("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(data.error || "Failed to change password")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = (key: keyof VisibilityState) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const saveVisibility = async () => {
    setIsLoading(true)
    
    const formData = new FormData()
    Object.entries(visibility).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    try {
      const res = await updateSectionVisibility(formData)
      if (res.success) {
        toast.success("Visibility settings saved!")
      } else {
        toast.error(res.error || "Failed to save")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500 * 1024) {
        toast.error("Favicon size should be less than 500KB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFavicon(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSiteSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append("siteName", siteName)
    formData.append("siteRole", siteRole)
    if (favicon) {
      formData.append("favicon", favicon)
    }

    try {
      const res = await updateSiteSettings(formData)
      if (res.success) {
        toast.success("Site identity updated successfully!")
      } else {
        toast.error(res.error || "Failed to update site identity")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="pb-20 max-w-5xl">
        <header className="mb-10 ml-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">System Settings</h1>
          <p className="text-muted-foreground font-medium mt-1">Configure your site identity, security, and visibility.</p>
        </header>

        {/* Site Identity Section */}
        <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Site Identity</h2>
              <p className="text-sm text-muted-foreground">Manage your website&apos;s name and favicon</p>
            </div>
          </div>

          <form onSubmit={handleSiteSettingsUpdate} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2">Site Name</label>
                <input 
                  type="text" 
                  value={siteName} 
                  onChange={e => setSiteName(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                  placeholder="Write your site name here"
                />
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2">Site Role / Subtitle</label>
                <input 
                  type="text" 
                  value={siteRole} 
                  onChange={e => setSiteRole(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                  placeholder="Write your site role or subtitle here"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2 mb-2">Site Favicon</label>
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-secondary/30 border border-dashed border-border flex items-center justify-center overflow-hidden relative group">
                  {favicon ? (
                    <Image src={favicon} alt="Favicon" width={80} height={80} className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                  <input 
                    type="file" 
                    id="favicon-upload" 
                    accept="image/*" 
                    onChange={handleFaviconUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-bold">CHANGE</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Upload a square image (ICO, PNG, or SVG). Max size 500KB.</p>
                  <label htmlFor="favicon-upload" className="text-sm text-primary font-bold cursor-pointer hover:underline">
                    Choose file...
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end pt-4 border-t border-border/50">
              <Button type="submit" disabled={isLoading} className="px-10 h-12 rounded-xl">
                {isLoading ? "Saving..." : "Save Site Settings"}
              </Button>
            </div>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Profile Section */}
          <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col h-fit">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Profile</h1>
                <p className="text-sm text-muted-foreground">Update your identity and email</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2"><User className="w-4 h-4"/> Name</label>
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Mail className="w-4 h-4"/> Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="pt-4 border-t border-border/50">
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 block">Confirm with Current Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    placeholder="Write your current password here"
                    value={passwordForProfile} 
                    onChange={e => setPasswordForProfile(e.target.value)} 
                    className="w-full h-12 bg-secondary/10 border border-border/50 rounded-xl px-4 pl-10 focus:outline-none focus:border-primary transition-all"
                  />
                  <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl">
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col h-fit">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Security</h1>
                <p className="text-sm text-muted-foreground">Change your password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">New Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl">
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>

        {/* Section Visibility */}
        <div className="mt-10 bg-background p-8 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Eye className="w-6 h-6" /> 
            </div>
            <div>
              <h2 className="text-2xl font-bold">Section Visibility</h2>
              <p className="text-sm text-muted-foreground">Toggle sections on or off on your portfolio</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { id: "showAbout", label: "About Me", state: visibility.showAbout },
              { id: "showProject", label: "Projects", state: visibility.showProject },
              { id: "showExp", label: "Experience", state: visibility.showExp },
              { id: "showEdu", label: "Education", state: visibility.showEdu },
              { id: "showSkill", label: "Skills", state: visibility.showSkill },
              { id: "showTesti", label: "Testimonials", state: visibility.showTesti },
              { id: "showContact", label: "Contact", state: visibility.showContact },
            ].map((sec) => (
              <div key={sec.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border/30">
                <span className="font-semibold text-sm">{sec.label}</span>
                <button
                  type="button"
                  onClick={() => handleToggle(sec.id as keyof VisibilityState)}
                  className={`w-12 h-6 rounded-full transition-all relative ${sec.state ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${sec.state ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={saveVisibility} disabled={isLoading} className="px-10 h-12 rounded-xl">
              {isLoading ? "Saving..." : "Save Visibility Settings"}
            </Button>
          </div>
        </div>

        {/* Security Recovery Card */}
        <div className="mt-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 rounded-2xl border border-indigo-500/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 text-indigo-600 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Password Recovery</h2>
              <p className="text-sm text-muted-foreground font-medium">Manage your security questions for account recovery.</p>
            </div>
          </div>
          <Link href="/admin/settings/security-questions">
            <Button variant="outline" className="h-12 px-8 rounded-xl border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-600 font-bold transition-all group">
              Manage Questions
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

    </div>
  )
}
