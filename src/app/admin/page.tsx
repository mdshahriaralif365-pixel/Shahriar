"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Layers, Briefcase, GraduationCap, Home, Wrench, Settings, Phone, User, Share2, Quote, Navigation, MessageSquare, Layout, ShieldQuestion, Sparkles, Monitor, UserCog } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/alert-custom"

export default function AdminDashboard() {
  const { status } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [securityCount, setSecurityCount] = useState(5) // Default to 5 to avoid flash
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/admin/login")
    }
    
    const fetchData = async () => {
      try {
        const [msgRes, secRes] = await Promise.all([
          fetch("/api/admin/messages/count"),
          fetch("/api/admin/settings/security-count")
        ])
        const msgData = await msgRes.json() as { count?: number }
        const secData = await secRes.json() as { count?: number }
        
        setUnreadCount(msgData.count || 0)
        setSecurityCount(secData.count ?? 5)
      } catch (err) {
        console.error("Dashboard data fetch error:", err)
      }
    }

    if (status === "authenticated") {
      fetchData()
      const interval = setInterval(fetchData, 30000)
      return () => clearInterval(interval)
    }
  }, [status])

  if (status === "loading") return null

  const groups = [
    {
      title: "Active Notifications",
      icon: <Sparkles className="w-5 h-5" />,
      highlight: unreadCount > 0,
      items: [
        { 
          name: "Messages", 
          icon: <MessageSquare className="w-6 h-6" />, 
          href: "/admin/messages", 
          description: "View and manage contact form submissions", 
          count: unreadCount,
          isCritical: unreadCount > 0
        },
      ]
    },
    {
      title: "Content Management",
      icon: <Monitor className="w-5 h-5" />,
      items: [
        { name: "Home Section", icon: <Home className="w-6 h-6" />, href: "/admin/home", description: "Edit your hero section intro and profile", isCritical: false, count: 0 },
        { name: "About Me", icon: <User className="w-6 h-6" />, href: "/admin/about", description: "Edit your biography and expertise cards", isCritical: false, count: 0 },
        { name: "Projects", icon: <Layers className="w-6 h-6" />, href: "/admin/projects", description: "Add or edit portfolio projects", isCritical: false, count: 0 },
        { name: "Experience", icon: <Briefcase className="w-6 h-6" />, href: "/admin/experience", description: "Manage your work experiences", isCritical: false, count: 0 },
        { name: "Education", icon: <GraduationCap className="w-6 h-6" />, href: "/admin/education", description: "Update your educational background", isCritical: false, count: 0 },
        { name: "Skills", icon: <Wrench className="w-6 h-6" />, href: "/admin/skills", description: "Manage your technical skills", isCritical: false, count: 0 },
        { name: "Testimonials", icon: <Quote className="w-6 h-6" />, href: "/admin/testimonials", description: "Manage client feedback", isCritical: false, count: 0 },
      ]
    },
    {
      title: "Appearance & Contact",
      icon: <Layout className="w-5 h-5" />,
      items: [
        { name: "Contact Info", icon: <Phone className="w-6 h-6" />, href: "/admin/contact", description: "Edit Get In Touch details", isCritical: false, count: 0 },
        { name: "Social links", icon: <Share2 className="w-6 h-6" />, href: "/admin/social", description: "Manage social profiles", isCritical: false, count: 0 },
        { name: "Navbar", icon: <Navigation className="w-6 h-6" />, href: "/admin/navbar", description: "Edit navigation and logo", isCritical: false, count: 0 },
        { name: "Footer", icon: <Monitor className="w-6 h-6" />, href: "/admin/footer", description: "Manage copyright info", isCritical: false, count: 0 },
      ]
    },
    {
      title: "System & Security",
      icon: <UserCog className="w-5 h-5" />,
      isWarning: securityCount < 5,
      items: [
        { name: "Settings", icon: <Settings className="w-6 h-6" />, href: "/admin/settings", description: "Manage profile & password", isCritical: false, count: 0 },
        { 
          name: "Security Questions", 
          icon: <ShieldQuestion className="w-6 h-6" />, 
          href: "/admin/settings/security-questions", 
          description: "Password recovery setup",
          isCritical: securityCount < 5,
          customLabel: securityCount < 5 ? "Incomplete" : `${securityCount}/30`
        },
      ]
    }
  ]

  const hasAnyAlert = unreadCount > 0 || securityCount < 5

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 ml-1">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your professional presence and site content.</p>
        </div>
        {hasAnyAlert && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter border animate-pulse ${unreadCount > 0 ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
            <span className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-red-600' : 'bg-amber-600'}`}></span>
            System Attention Required
          </div>
        )}
      </div>

        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center justify-between mb-6 ml-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${group.highlight ? 'bg-red-500/10 text-red-600 animate-pulse' : group.isWarning ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-primary/10 text-primary'}`}>
                    {group.icon}
                  </div>
                  <h2 className={`text-lg font-black uppercase tracking-wider ${group.highlight ? 'text-red-600' : group.isWarning ? 'text-amber-600' : 'text-foreground/80'}`}>
                    {group.title}
                  </h2>
                </div>
                {(group.highlight || group.isWarning) && (
                   <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border animate-pulse ${group.highlight ? 'text-red-500 bg-red-500/5 border-red-500/10' : 'text-amber-600 bg-amber-500/5 border-amber-500/10'}`}>
                     {group.highlight ? 'Attention Required' : 'Security Warning'}
                   </span>
                )}
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map(sec => (
                  <Link 
                    key={sec.name} 
                    href={sec.href} 
                    className={`bg-background p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group relative overflow-hidden ${sec.isCritical ? 'border-red-500/40 shadow-red-500/5' : 'border-border/50 hover:border-primary/40'}`}
                  >
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 mb-6 shadow-inner ${sec.isCritical ? 'bg-red-500 text-white shadow-red-500/40' : 'bg-secondary/50 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground'}`}>
                      {sec.icon}
                    </div>
                    
                    {sec.isCritical && (
                      <div className="absolute top-6 right-6 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </div>
                    )}

                    <h3 className="font-bold text-lg mb-2 text-foreground flex items-center gap-2">
                      {sec.name}
                      {sec.count !== undefined && sec.count > 0 && (
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all ${sec.isCritical ? 'bg-white text-red-500 shadow-lg' : 'bg-primary text-primary-foreground animate-pulse'}`}>
                          {sec.count}
                        </span>
                      )}
                      {(sec as unknown as { customLabel?: string }).customLabel && (
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${sec.isCritical ? 'bg-white/20 text-white border border-white/30' : 'bg-primary/10 text-primary'}`}>
                          {(sec as unknown as { customLabel?: string }).customLabel}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">{sec.description}</p>
                    
                    {/* Decorative Element */}
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full blur-2xl transition-colors ${sec.isCritical ? 'bg-red-500/10' : 'bg-primary/5 group-hover:bg-primary/10'}`} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      <ConfirmDialog 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => signOut()}
        title="Sign Out?"
        description="Are you sure you want to end your current session? You will need to login again to access the admin panel."
        confirmText="Yes, Logout"
        type="danger"
      />
    </div>
  )
}
