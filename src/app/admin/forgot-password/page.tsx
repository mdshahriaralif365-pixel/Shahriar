"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShieldCheck, HelpCircle, Lock, ArrowLeft, Mail, Key, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getResetQuestions, verifySecurityAnswers, verifyAndReset } from "./actions"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: Email, 2: Questions, 3: New Password
  const [email, setEmail] = useState("")
  const [questions, setQuestions] = useState<{id: string, question: string}[]>([])
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleFetchQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await getResetQuestions(email)
      if (res.questions) {
        setQuestions(res.questions)
        setAnswers(res.questions.map(q => ({ questionId: q.id, answer: "" })))
        setStep(2)
      } else {
        setError(res.error || "Could not initiate recovery")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await verifySecurityAnswers(email, answers)
      if (res.success) {
        setStep(3)
      } else {
        setError(res.error || "Verification failed")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Re-send all data to final reset action to be stateless/secure
      const res = await verifyAndReset({ email, answers, password })
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin/login")
        }, 3000)
      } else {
        setError(res.error || "Reset failed. Try starting over.")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none -z-10" />
      
      <div className="max-w-md w-full bg-background p-8 rounded-3xl border border-border/50 shadow-2xl relative z-10 transition-all">
        
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">Password Reset!</h1>
            <p className="text-muted-foreground mb-8 text-sm">
              Your password has been reset successfully. Redirecting to login...
            </p>
            <Button asChild className="w-full h-12 rounded-xl">
              <Link href="/admin/login">Go to Login</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              {step === 1 && <Mail className="w-8 h-8" />}
              {step === 2 && <ShieldCheck className="w-8 h-8" />}
              {step === 3 && <Lock className="w-8 h-8" />}
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
              {step === 1 && "Reset Password"}
              {step === 2 && "Security Check"}
              {step === 3 && "Set New Password"}
            </h1>
            
            <p className="text-center text-muted-foreground mb-8 text-sm px-4">
              {step === 1 && "Confirm your admin email to begin recovery"}
              {step === 2 && "Correctly answer the following security questions"}
              {step === 3 && "Create a new secure password for your account"}
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-medium p-4 rounded-xl text-center mb-6 border border-destructive/20">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleFetchQuestions} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Admin Email
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-all" 
                    placeholder="Write your admin email here"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/10">
                  {isLoading ? "Checking..." : "Verify Email"}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyQuestions} className="space-y-6">
                <div className="space-y-5">
                   {questions.map((q, idx) => (
                     <div key={q.id} className="space-y-2">
                       <label className="text-sm font-semibold text-foreground flex items-start gap-2">
                         <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /> 
                         <span>{q.question}</span>
                       </label>
                       <input 
                         type="text" 
                         required 
                         autoComplete="off"
                         value={answers[idx]?.answer || ""} 
                         onChange={(e) => {
                           const newAns = [...answers]
                           newAns[idx].answer = e.target.value
                           setAnswers(newAns)
                         }}
                         className="w-full h-11 bg-secondary/30 border border-border/50 rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-all text-sm font-medium" 
                         placeholder="Write your answer here"
                       />
                     </div>
                   ))}
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/10">
                  {isLoading ? "Verifying..." : "Verify Answers"}
                </Button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">Wrong email?</button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-5">
                  <div className="relative">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Key className="w-4 h-4 text-primary" /> New Password
                    </label>
                    <div className="relative mt-2">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full h-12 bg-secondary/30 border border-border/50 rounded-xl px-4 pr-12 text-foreground focus:outline-none focus:border-primary transition-all" 
                        placeholder="Write new password here"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                    <input 
                      type="password" 
                      required 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="w-full h-12 bg-secondary/30 mt-2 border border-border/50 rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-all" 
                      placeholder="Confirm your new password here"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                  {isLoading ? "Resetting..." : "Update Password"}
                </Button>
              </form>
            )}

            <div className="text-center mt-8">
              <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
