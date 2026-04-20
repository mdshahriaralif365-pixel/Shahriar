"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, ArrowLeft } from "lucide-react"
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter, FacebookIcon as Facebook, InstagramIcon as Instagram } from "@/components/icons"
import Link from "next/link"
import { getSocialLinks, updateSocialLinks } from "./actions"

export default function SocialSettingsPage() {
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [twitter, setTwitter] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getSocialLinks().then((links) => {
      setGithub(links.github || "")
      setLinkedin(links.linkedin || "")
      setTwitter(links.twitter || "")
      setFacebook(links.facebook || "")
      setInstagram(links.instagram || "")
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const formData = new FormData()
    formData.append("github", github)
    formData.append("linkedin", linkedin)
    formData.append("twitter", twitter)
    formData.append("facebook", facebook)
    formData.append("instagram", instagram)

    try {
      const res = await updateSocialLinks(formData)
      if (res?.success) {
        setSuccess("Social links updated successfully!")
      } else {
        setError(res?.error || "Failed to update social links")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm transition-all flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Social Media Links</h1>
              <p className="text-sm text-muted-foreground">Manage your profiles across the web</p>
            </div>
          </div>

          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}
          {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Github className="w-4 h-4" /> GitHub URL</label>
              <input 
                type="url" 
                value={github} 
                onChange={e => setGithub(e.target.value)} 
                className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                placeholder="Write your GitHub URL here"
              />
            </div>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Linkedin className="w-4 h-4" /> LinkedIn URL</label>
              <input 
                type="url" 
                value={linkedin} 
                onChange={e => setLinkedin(e.target.value)} 
                className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                placeholder="Write your LinkedIn URL here"
              />
            </div>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Twitter className="w-4 h-4" /> Twitter / X URL</label>
              <input 
                type="url" 
                value={twitter} 
                onChange={e => setTwitter(e.target.value)} 
                className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                placeholder="Write your Twitter/X URL here"
              />
            </div>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Facebook className="w-4 h-4" /> Facebook URL</label>
              <input 
                type="url" 
                value={facebook} 
                onChange={e => setFacebook(e.target.value)} 
                className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                placeholder="Write your Facebook URL here"
              />
            </div>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Instagram className="w-4 h-4" /> Instagram URL</label>
              <input 
                type="url" 
                value={instagram} 
                onChange={e => setInstagram(e.target.value)} 
                className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                placeholder="Write your Instagram URL here"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg rounded-2xl font-bold mt-4 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              {isLoading ? "Saving..." : "Save Social Links"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
