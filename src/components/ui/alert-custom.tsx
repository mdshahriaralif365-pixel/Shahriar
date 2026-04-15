"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { useEffect, useState } from "react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info"
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!mounted) return null

  const icons = {
    danger: <AlertCircle className="w-8 h-8 text-destructive" />,
    warning: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
    info: <Info className="w-8 h-8 text-primary" />
  }

  const colors = {
    danger: "bg-destructive/10 border-destructive/20 text-destructive",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600",
    info: "bg-primary/10 border-primary/20 text-primary"
  }

  const buttonColors = {
    danger: "bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/20",
    info: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-background border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors[type]}`}>
                  {icons[type]}
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">
                {title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="h-14 rounded-2xl font-bold text-lg hover:bg-secondary transition-all active:scale-95"
                >
                  {cancelText}
                </Button>
                <Button 
                  onClick={() => {
                    onConfirm()
                    onClose()
                  }}
                  className={`h-14 rounded-2xl font-bold text-lg transition-all active:scale-95 ${buttonColors[type]}`}
                >
                  {confirmText}
                </Button>
              </div>
            </div>

            {/* Accent Glow */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${type === 'danger' ? 'bg-destructive' : 'bg-primary'}`} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function AlertCustom({
  message,
  type = "info",
  onClose
}: {
  message: string
  type?: "success" | "error" | "info"
  onClose?: () => void
}) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }

  const styles = {
    success: "bg-green-500/10 border-green-500/20 text-green-600",
    error: "bg-destructive/10 border-destructive/20 text-destructive",
    info: "bg-primary/10 border-primary/20 text-primary"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-4 rounded-2xl border ${styles[type]} shadow-sm`}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 text-sm font-semibold leading-none">{message}</p>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-background/20 rounded-md transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )
}
