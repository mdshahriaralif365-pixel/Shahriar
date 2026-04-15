"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Navigation } from "lucide-react"
import Link from "next/link"

interface NavLinkData {
  id?: string
  name: string
  href: string
  isActive?: boolean
  order?: number
}

export default function NavbarAdminPage() {
  const [logoText, setLogoText] = useState("ALIF.")
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [ctaText, setCtaText] = useState("Hire Me")
  const [ctaLink, setCtaLink] = useState("#contact")
  const [showCTA, setShowCTA] = useState(false)
  const [navLinks, setNavLinks] = useState<NavLinkData[]>([])
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
      const res = await fetch("/api/admin/navbar")
      const data = await res.json()
      if (data) {
        setLogoText(data.logoText || "ALIF.")
        setLogoImage(data.logoImage || null)
        setCtaText(data.ctaText || "Hire Me")
        setCtaLink(data.ctaLink || "#contact")
        setShowCTA(data.showCTA || false)
        setNavLinks(data.navLinks || [])
      }
    } catch {
      setError("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLink = () => {
    const nextOrder = navLinks.length > 0 ? Math.max(...navLinks.map(l => l.order || 0)) + 1 : 0
    setNavLinks([...navLinks, { name: "", href: "", isActive: true, order: nextOrder }])
  }

  const handleRemoveLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index))
  }

  const handleLinkChange = (index: number, field: keyof NavLinkData, value: string | boolean | number) => {
    const newLinks = [...navLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setNavLinks(newLinks)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        setError("Image size should be less than 1MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/admin/navbar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoText,
          logoImage,
          ctaText,
          ctaLink,
          showCTA,
          navLinks,
        }),
      })

      if (res.ok) {
        setSuccess("Navbar settings updated successfully")
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
                <Navigation className="w-6 h-6 text-primary" />
                Navbar Settings
              </h1>
              <p className="text-sm text-muted-foreground">Manage your site logo and navigation links</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
          </Button>
        </header>

        {error && <div className="bg-destructive/10 text-destructive p-4 rounded-2xl mb-6 text-center font-medium border border-destructive/20">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-600 p-4 rounded-2xl mb-6 text-center font-medium border border-green-500/20">{success}</div>}

        <div className="grid gap-8">
          {/* Logo & CTA Section */}
          <div className="bg-background rounded-3xl p-6 border border-border/50 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">General Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Logo Text (Fallback)</label>
                <input 
                  type="text" 
                  value={logoText} 
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-lg font-bold"
                  placeholder="Write logo text here"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Logo Image</label>
                <div className="flex flex-col gap-4">
                  {logoImage && (
                    <div className="p-4 bg-secondary/20 rounded-2xl border border-border/50">
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="bg-background/80 p-2 rounded-lg border border-border">
                           <Image src={logoImage} alt="Current Logo" width={100} height={48} className="h-12 w-auto object-contain" unoptimized />
                        </div>
                        <button 
                          type="button"
                          onClick={() => setLogoImage(null)}
                          className="px-6 py-2.5 bg-destructive text-white rounded-xl hover:bg-destructive/90 transition-all font-bold shadow-lg shadow-destructive/20 flex items-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Remove Logo Image
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!logoImage && (
                    <div className="flex flex-col gap-3">
                      <input 
                        type="file" 
                        id="logo-upload"
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label 
                        htmlFor="logo-upload"
                        className="flex items-center justify-center gap-2 h-14 px-8 bg-primary text-primary-foreground rounded-2xl font-bold cursor-pointer hover:shadow-xl hover:shadow-primary/20 transition-all w-max border-2 border-primary/20"
                      >
                         <Plus className="w-5 h-5" /> Choose Logo Image
                      </label>
                      <p className="text-xs text-muted-foreground italic pl-1">Max size: 1MB. Transparent PNG recommended.</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Show CTA Button</label>
                <div className="flex items-center gap-4 mt-2 h-10">
                   <button 
                    onClick={() => setShowCTA(!showCTA)}
                    className={`w-14 h-8 rounded-full p-1 transition-all ${showCTA ? 'bg-primary' : 'bg-secondary'}`}
                   >
                     <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${showCTA ? 'translate-x-6' : 'translate-x-0'}`} />
                   </button>
                   <span className="text-sm text-muted-foreground">{showCTA ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
              {showCTA && (
                <>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">CTA Button Text</label>
                    <input 
                      type="text" 
                      value={ctaText} 
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                      placeholder="Write CTA button text here"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">CTA Button Link</label>
                    <input 
                      type="text" 
                      value={ctaLink} 
                      onChange={(e) => setCtaLink(e.target.value)}
                      className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
                      placeholder="Write CTA button link here"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Nav Links Section */}
          <div className="bg-background rounded-3xl p-6 border border-border/50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Navigation Links</h2>
              <Button onClick={handleAddLink} variant="outline" size="sm" className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Add Link
              </Button>
            </div>

            <div className="space-y-4">
              {navLinks.length === 0 ? (
                <div className="text-center py-10 bg-secondary/20 rounded-2xl border-2 border-dashed border-border/50">
                   <p className="text-muted-foreground">No navigation links added yet.</p>
                </div>
              ) : (
                navLinks.map((link, index) => (
                  <div key={index} className="flex gap-4 items-end bg-secondary/20 p-4 rounded-2xl border border-border/50 group transition-all hover:bg-secondary/30">
                    <div className="text-muted-foreground cursor-grab active:cursor-grabbing pb-3">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Link Name</label>
                        <input 
                          type="text" 
                          value={link.name} 
                          onChange={(e) => handleLinkChange(index, "name", e.target.value)}
                          className="w-full h-10 bg-background border border-border/50 rounded-lg px-3 focus:outline-none focus:border-primary transition-all text-sm"
                          placeholder="Write section name here"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Link URL / ID</label>
                        <input 
                          type="text" 
                          value={link.href} 
                          onChange={(e) => handleLinkChange(index, "href", e.target.value)}
                          className="w-full h-10 bg-background border border-border/50 rounded-lg px-3 focus:outline-none focus:border-primary transition-all text-sm"
                          placeholder="Write section ID here (e.g. #about)"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Order</label>
                        <input 
                          type="number" 
                          value={link.order || 0} 
                          onChange={(e) => handleLinkChange(index, "order", parseInt(e.target.value) || 0)}
                          className="w-full h-10 bg-background border border-border/50 rounded-lg px-3 focus:outline-none focus:border-primary transition-all text-sm text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Visibility</label>
                        <div className="flex items-center gap-3 h-10">
                          <button 
                            onClick={() => handleLinkChange(index, "isActive", link.isActive === false ? true : false)}
                            className={`w-12 h-6 rounded-full p-1 transition-all ${link.isActive !== false ? 'bg-primary' : 'bg-secondary'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all ${link.isActive !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                          <span className="text-xs font-medium">{link.isActive !== false ? 'Active' : 'Disabled'}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveLink(index)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
