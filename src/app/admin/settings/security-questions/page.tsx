"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2, ShieldQuestion, HelpCircle, AlertCircle, ChevronDown, Check, Search } from "lucide-react"
import { deleteSecurityAnswer, addSecurityQuestion, updateSecurityQuestion, getSecurityQuestions } from "./actions"
import { ConfirmDialog } from "@/components/ui/alert-custom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Question {
  id: string
  question: string
  hasAnswer: boolean
}

export default function SecurityQuestionsAdmin() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [newAnswer, setNewAnswer] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuestionText, setEditQuestionText] = useState("")
  const [editAnswer, setEditAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // Custom Alert State
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setIsLoading(true)
    try {
      const data = await getSecurityQuestions()
      setQuestions(data as Question[])
    } catch {
      toast.error("Failed to load questions")
    } finally {
      setIsLoading(false)
    }
  }

  const answeredQuestions = questions.filter(q => q.hasAnswer)
  const availableQuestions = questions.filter(q => !q.hasAnswer)

  const filteredPool = availableQuestions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuestion || !newAnswer.trim()) {
      toast.error("Please select a question and provide an answer")
      return
    }

    try {
      const res = await addSecurityQuestion(selectedQuestion.id, newAnswer)
      if (res.success) {
        setSelectedQuestion(null)
        setNewAnswer("")
        toast.success("Security answer saved successfully")
        loadQuestions()
      } else {
        toast.error(res.error || "Failed to add")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const res = await updateSecurityQuestion(id, editQuestionText, editAnswer || undefined)
      if (res.success) {
        setEditingId(null)
        setEditAnswer("")
        toast.success("Answer updated successfully")
        loadQuestions()
      } else {
        toast.error(res.error || "Failed to update")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSecurityAnswer(id)
      if (res.success) {
        toast.success("Security answer removed")
        loadQuestions()
      } else {
        toast.error(res.error || "Failed to delete")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="pb-20 max-w-5xl">
        <header className="mb-10 ml-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Security Manager</h1>
          <p className="text-muted-foreground font-medium mt-1">Setup your secure password recovery questions pool.</p>
        </header>

        <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary/80">
            <Plus className="w-5 h-5" /> Answer a New Question
          </h2>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Choose Question</label>
                
                {/* Custom Dropdown */}
                <div className="relative">
                  <div 
                    onClick={() => !isLoading && availableQuestions.length > 0 && setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full h-14 bg-secondary/40 border ${isDropdownOpen ? 'border-primary shadow-lg shadow-primary/5' : 'border-border/50'} rounded-2xl px-5 flex items-center justify-between cursor-pointer transition-all hover:bg-secondary/60`}
                  >
                    <span className={`text-sm font-bold truncate ${selectedQuestion ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {selectedQuestion ? selectedQuestion.question : (isLoading ? "Loading..." : "-- Select from Pool --")}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 right-0 top-16 z-50 bg-background border border-border shadow-2xl rounded-2xl overflow-hidden"
                      >
                        <div className="p-2 border-b border-border/50 bg-secondary/20">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input 
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search questions here..."
                              className="w-full h-10 bg-background border border-border/50 rounded-xl pl-9 pr-4 text-xs focus:outline-none focus:border-primary"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          {filteredPool.length === 0 ? (
                            <div className="p-6 text-center text-xs text-muted-foreground italic">
                              No matching questions found.
                            </div>
                          ) : (
                            filteredPool.map((q) => (
                              <div 
                                key={q.id}
                                onClick={() => {
                                  setSelectedQuestion(q)
                                  setIsDropdownOpen(false)
                                  setSearchQuery("")
                                }}
                                className="px-5 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors flex items-center justify-between border-b border-border/10 last:border-0 text-foreground"
                              >
                                {q.question}
                                {selectedQuestion?.id === q.id && <Check className="w-4 h-4" />}
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase px-1">Your Secret Answer</label>
                <input 
                  type="text" 
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your secret answer here"
                  className="w-full h-14 bg-secondary/30 border border-border/50 rounded-2xl px-5 focus:outline-none focus:border-primary transition-all font-bold"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={!selectedQuestion || !newAnswer} className="h-14 px-12 rounded-2xl gap-3 font-bold shadow-xl shadow-primary/20 text-lg transition-transform active:scale-95 disabled:opacity-50">
                <ShieldQuestion className="w-6 h-6" /> Save Security Answer
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
               Active Questions 
               <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{answeredQuestions.length}</span>
            </h2>
            {answeredQuestions.length < 5 && (
              <span className="text-[10px] font-black text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-tighter border border-amber-500/20 flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                min. 5 required for active recovery
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div className="p-10 text-center animate-pulse text-muted-foreground">Loading active pool...</div>
          ) : answeredQuestions.length === 0 ? (
            <div className="p-12 bg-background rounded-[2.5rem] border border-dashed border-border text-center text-muted-foreground italic">
              You haven&apos;t set any security questions yet. Select from the pool above.
            </div>
          ) : (
            <div className="grid gap-4">
            {answeredQuestions.map((q) => (
              <div key={q.id} className="bg-background p-6 rounded-2xl border border-border/50 shadow-sm group hover:border-primary/40 transition-all">
                {editingId === q.id ? (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Question</label>
                        <div className="w-full h-12 flex items-center bg-secondary/10 px-4 rounded-xl text-sm font-medium text-muted-foreground border border-border/50">
                          {q.question}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">New Answer</label>
                        <input 
                          type="text" 
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          placeholder="Write new answer here"
                          className="w-full h-12 bg-secondary/30 border border-primary/40 rounded-xl px-4 focus:outline-none focus:border-primary font-bold"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                       <Button size="sm" onClick={() => handleUpdate(q.id)} className="h-11 px-8 rounded-xl font-bold text-base shadow-lg shadow-primary/20">Update Answer</Button>
                       <Button size="sm" onClick={() => setEditingId(null)} variant="outline" className="h-11 px-8 rounded-xl font-bold">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-foreground leading-tight">{q.question}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-600">
                            ✓ Active & Encrypted
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setEditingId(q.id); setEditQuestionText(q.question); setEditAnswer(""); }}
                        className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                        title="Update Answer"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ isOpen: true, id: q.id })}
                        className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all"
                        title="Remove Answer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </div>

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Remove Security Answer?"
        description="This will clear your answer for this question. You can pick another question from the pool later."
        confirmText="Yes, Remove"
        type="danger"
      />
    </div>
  )
}
