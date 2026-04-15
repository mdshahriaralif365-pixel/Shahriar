"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Trash2, CheckCircle, Clock, Search } from "lucide-react"
import { getMessages, markAsRead, deleteMessage } from "./actions"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/alert-custom"
import { toast } from "sonner"

interface Message {
  id: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: Date
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const data = await getMessages()
    setMessages(data)
    setLoading(false)
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: true } : msg))
      toast.success("Message marked as read")
    } catch {
      toast.error("Failed to mark as read")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id)
      setMessages(prev => prev.filter(msg => msg.id !== id))
      toast.success("Message deleted successfully")
    } catch {
      toast.error("Failed to delete message")
    }
  }

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === "unread") return matchesSearch && !msg.isRead
    if (filter === "read") return matchesSearch && msg.isRead
    return matchesSearch
  })

  return (
    <div className="pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ml-1">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
              Contact Messages
              <span className="text-xs font-black uppercase tracking-tighter bg-primary/10 text-primary px-3 py-1 rounded-lg">
                {messages.filter(m => !m.isRead).length} New
              </span>
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Review and manage messages from your site visitors.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="pl-10 pr-4 h-10 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary w-full md:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="h-10 px-4 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary text-sm transition-all font-bold"
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "unread" | "read")}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Message List */}
        <div className="space-y-4 pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-background rounded-2xl border border-dashed border-border/50">
              <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse font-medium">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-24 bg-background rounded-2xl border border-dashed border-border/50">
              <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-1">No messages found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filteredMessages.map((msg: Message) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className={`group relative bg-background p-6 rounded-2xl border transition-all hover:shadow-xl ${!msg.isRead ? 'border-primary/40 shadow-lg shadow-primary/5 bg-primary/5' : 'border-border/50 shadow-sm'}`}
                  >
                    {!msg.isRead && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{msg.name}</h3>
                          <span className="text-sm text-muted-foreground truncate max-w-[200px]">({msg.email})</span>
                        </div>
                        <p className="text-foreground/80 leading-relaxed translate-y-0 text-sm whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      <div className="flex md:flex-col items-center justify-end gap-3 min-w-[140px]">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/40 px-3 py-1 rounded-full mb-auto md:mb-0">
                          <Clock className="w-3 h-3" />
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                        
                        <div className="flex gap-2">
                          {!msg.isRead && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-10 px-4 rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:border-emerald-500 font-bold"
                              onClick={() => handleMarkAsRead(msg.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark Read
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-10 px-4 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive font-bold"
                            onClick={() => setDeleteConfirm({ isOpen: true, id: msg.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Delete Message?"
        description="Are you sure you want to permanently delete this message? This action cannot be undone."
        confirmText="Yes, Delete it"
        type="danger"
      />
    </div>
  )
}
