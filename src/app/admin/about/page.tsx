"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft, Save, Sparkles, Layout } from "lucide-react"
import Link from "next/link"
import { getAboutData, updateAboutData } from "./actions"

export default function AboutSettingsPage() {
  const [bio, setBio] = useState("")
  const [card1Title, setCard1Title] = useState("")
  const [card1Desc, setCard1Desc] = useState("")
  const [card2Title, setCard2Title] = useState("")
  const [card2Desc, setCard2Desc] = useState("")
  const [card3Title, setCard3Title] = useState("")
  const [card3Desc, setCard3Desc] = useState("")
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getAboutData().then((data) => {
      if (data) {
        setBio(data.bio || "")
        setCard1Title(data.card1Title || "")
        setCard1Desc(data.card1Desc || "")
        setCard2Title(data.card2Title || "")
        setCard2Desc(data.card2Desc || "")
        setCard3Title(data.card3Title || "")
        setCard3Desc(data.card3Desc || "")
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const formData = new FormData()
    formData.append("bio", bio)
    formData.append("card1Title", card1Title)
    formData.append("card1Desc", card1Desc)
    formData.append("card2Title", card2Title)
    formData.append("card2Desc", card2Desc)
    formData.append("card3Title", card3Title)
    formData.append("card3Desc", card3Desc)

    try {
      const res = await updateAboutData(formData)
      if (res?.success) {
        setSuccess("About information updated successfully!")
      } else {
        setError(res?.error || "Failed to update information")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Bio Section */}
          <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm transition-all flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">About Me Section</h1>
                <p className="text-sm text-muted-foreground">Manage your biography and intro text</p>
              </div>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}
            {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>}

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-primary" /> Biography</label>
                <textarea 
                  required
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  rows={8}
                  className="w-full bg-secondary/30 mt-2 border border-border/50 rounded-xl p-4 focus:outline-none focus:border-primary transition-all resize-none"
                  placeholder="Tell your story..."
                />
                <p className="text-xs text-muted-foreground mt-1">Use newline for different paragraphs.</p>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Expertise Cards</h2>
                <p className="text-sm text-muted-foreground">Edit the 3 feature cards in the About section</p>
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-8">
              {/* Card 1 */}
              <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">Card 1</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                    <input 
                      type="text" 
                      value={card1Title} 
                      onChange={e => setCard1Title(e.target.value)} 
                      className="w-full h-10 bg-background mt-1 border border-border/50 rounded-lg px-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                    <textarea 
                      value={card1Desc} 
                      onChange={e => setCard1Desc(e.target.value)} 
                      rows={2}
                      className="w-full bg-background mt-1 border border-border/50 rounded-lg p-3 focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">Card 2</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                    <input 
                      type="text" 
                      value={card2Title} 
                      onChange={e => setCard2Title(e.target.value)} 
                      className="w-full h-10 bg-background mt-1 border border-border/50 rounded-lg px-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                    <textarea 
                      value={card2Desc} 
                      onChange={e => setCard2Desc(e.target.value)} 
                      rows={2}
                      className="w-full bg-background mt-1 border border-border/50 rounded-lg p-3 focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">Card 3</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                    <input 
                      type="text" 
                      value={card3Title} 
                      onChange={e => setCard3Title(e.target.value)} 
                      className="w-full h-10 bg-background mt-1 border border-border/50 rounded-lg px-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                    <textarea 
                      value={card3Desc} 
                      onChange={e => setCard3Desc(e.target.value)} 
                      rows={2}
                      className="w-full bg-background mt-1 border border-border/50 rounded-lg p-3 focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="h-14 px-10 text-lg rounded-2xl font-bold shadow-xl flex items-center gap-2">
              <Save className="w-5 h-5" />
              {isLoading ? "Saving Changes..." : "Save All Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
