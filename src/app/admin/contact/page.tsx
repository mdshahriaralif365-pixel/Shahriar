"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, ArrowLeft, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { getContactInfo, updateContactInfo } from "./actions"

export default function ContactSettingsPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getContactInfo().then((info) => {
      setEmail(info.email || "")
      setPhone(info.phone || "")
      setLocation(info.location || "")
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("phone", phone)
    formData.append("location", location)

    try {
      const res = await updateContactInfo(formData)
      if (res?.success) {
        setSuccess("Contact information updated successfully!")
      } else {
        setError(res?.error || "Failed to update contact info")
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
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Contact Info Settings</h1>
              <p className="text-sm text-muted-foreground">Manage details for the Get In Touch section</p>
            </div>
          </div>

          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}
          {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 pt-2"><Mail className="w-4 h-4 text-primary" /> Email Address</label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 pt-2"><Phone className="w-4 h-4 text-primary" /> Phone Number</label>
              <input 
                type="text" 
                required
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 pt-2"><MapPin className="w-4 h-4 text-primary" /> Location</label>
              <input 
                type="text" 
                required
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl mt-4">
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
