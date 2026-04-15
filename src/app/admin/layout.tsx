"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, Layers, Briefcase, GraduationCap, 
  Home, LogOut, Wrench, Settings, Phone, User, 
  Share2, Quote, Navigation, MessageSquare, 
  ShieldQuestion, Monitor, UserCog,
  Menu, X, ChevronRight, Globe
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/admin" },
  { 
    title: "Content",
    items: [
      { name: "Home Section", icon: <Home className="w-5 h-5" />, href: "/admin/home" },
      { name: "About Me", icon: <User className="w-5 h-5" />, href: "/admin/about" },
      { name: "Projects", icon: <Layers className="w-5 h-5" />, href: "/admin/projects" },
      { name: "Experience", icon: <Briefcase className="w-5 h-5" />, href: "/admin/experience" },
      { name: "Education", icon: <GraduationCap className="w-5 h-5" />, href: "/admin/education" },
      { name: "Skills", icon: <Wrench className="w-5 h-5" />, href: "/admin/skills" },
      { name: "Testimonials", icon: <Quote className="w-5 h-5" />, href: "/admin/testimonials" },
    ]
  },
  {
    title: "Appearance",
    items: [
      { name: "Contact Info", icon: <Phone className="w-5 h-5" />, href: "/admin/contact" },
      { name: "Social Links", icon: <Share2 className="w-5 h-5" />, href: "/admin/social" },
      { name: "Navbar", icon: <Navigation className="w-5 h-5" />, href: "/admin/navbar" },
      { name: "Footer", icon: <Monitor className="w-5 h-5" />, href: "/admin/footer" },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Messages", icon: <MessageSquare className="w-5 h-5" />, href: "/admin/messages" },
      { name: "Settings", icon: <Settings className="w-5 h-5" />, href: "/admin/settings" },
      { name: "Security", icon: <ShieldQuestion className="w-5 h-5" />, href: "/admin/settings/security-questions" },
    ]
  }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [status, pathname, router])

  if (!isMounted) return null
  if (pathname === "/admin/login") return <>{children}</>

  return (
    <div className="min-h-screen bg-secondary/5 flex">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-72 flex-col bg-background border-r border-border/50 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-border/40">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight leading-none text-foreground">Portfolio CMS</h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-6">
            {navItems.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {group.title && (
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 mb-3">
                    {group.title}
                  </h2>
                )}
                {(group.items || [group]).map((item: { name?: string; icon?: React.ReactNode; href: string }) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold transition-all duration-200 group relative overflow-hidden ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      {item.name}
                      {isActive && (
                        <motion.div 
                          layoutId="active-nav"
                          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/50"
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-border/40">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 h-12 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-background border-r border-border/50 z-[70] lg:hidden flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">A</div>
                <h1 className="font-black text-lg">Admin</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {navItems.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    {group.title && (
                      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 mb-2">
                        {group.title}
                      </h2>
                    )}
                    {(group.items || [group]).map((item: { name?: string; icon?: React.ReactNode; href: string }) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold transition-all ${
                          pathname === item.href 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-border/40">
               <button onClick={() => signOut()} className="flex items-center gap-3 w-full px-4 h-12 rounded-xl text-sm font-bold text-destructive">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 lg:h-14 bg-background border-b border-border/40 flex items-center justify-between px-4 lg:px-8 z-50 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
             <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Link href="/admin" className="hover:text-primary transition-colors uppercase tracking-widest">Admin</Link>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-foreground uppercase tracking-widest">{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</span>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/" target="_blank" className="flex items-center gap-2 px-3 h-9 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold hover:bg-secondary/80 transition-all group">
                <Globe className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> 
                <span className="hidden sm:inline">Live Site</span>
             </Link>
             <div className="w-px h-6 bg-border/40 mx-1" />
             <div className="flex items-center gap-3 pl-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-foreground leading-none">{session?.user?.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Administrator</p>
                </div>
             </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  )
}

