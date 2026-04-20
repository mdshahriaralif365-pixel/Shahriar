"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send, MapPin, Mail, Phone, CheckCircle2 } from "lucide-react"

import { Button } from "./ui/button"
import { submitContact } from "@/actions/contact"
import { SectionHeading } from "./about"

const formSchema = z.object({
  name:    z.string().min(2, { message: "Name must be at least 2 characters." }),
  email:   z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

const contactInfoColors = [
  { color: "oklch(0.55 0.24 295)", bg: "oklch(0.55 0.24 295 / 0.1)", border: "oklch(0.55 0.24 295 / 0.2)" },
  { color: "oklch(0.65 0.2 180)",  bg: "oklch(0.65 0.2 180 / 0.1)",  border: "oklch(0.65 0.2 180 / 0.2)"  },
  { color: "oklch(0.7 0.2 340)",   bg: "oklch(0.7 0.2 340 / 0.1)",   border: "oklch(0.7 0.2 340 / 0.2)"   },
]

export function Contact({ data }: { data?: { email: string; phone: string; location: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const email    = data?.email    || "shahriar.alif@example.com"
  const phone    = data?.phone    || "+880 1234-567890"
  const location = data?.location || "Dhaka, Bangladesh"

  const contactInfo = [
    { icon: <Mail className="h-5 w-5" />,   label: "Email Me",   value: email,    href: `mailto:${email}`,                        ...contactInfoColors[0] },
    { icon: <Phone className="h-5 w-5" />,  label: "Call Me",    value: phone,    href: `tel:${phone.replace(/\s+/g, "")}`,       ...contactInfoColors[1] },
    { icon: <MapPin className="h-5 w-5" />, label: "Location",   value: location, href: undefined,                                ...contactInfoColors[2] },
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setSuccessMsg("")
    const res = await submitContact(values)
    setIsSubmitting(false)
    if (res.success) {
      setSuccessMsg(res.message)
      form.reset()
    } else {
      setSuccessMsg("Something went wrong, please try again.")
    }
  }

  const inputClass = `
    w-full bg-secondary/30 border border-border/50 rounded-2xl px-5
    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
    outline-none transition-all text-foreground placeholder:text-muted-foreground/60
    font-medium
  `

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 100%, oklch(0.55 0.24 295 / 0.07), transparent)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.025] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.55 0.24 295) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.55 0.24 295) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <SectionHeading
          label="Say Hello"
          title="Get In Touch"
          subtitle="Have a project in mind or want to collaborate? Feel free to reach out — I'll get back to you as soon as possible."
        />

        <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-start max-w-5xl mx-auto">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:col-span-2 space-y-5"
          >
            <div className="p-7 rounded-3xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-xl font-bold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-5">
                {contactInfo.map(({ icon, label, value, href, color, bg, border }, i) => (
                  <motion.div
                    key={label}
                    className="flex items-center gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: bg, color, border: `1px solid ${border}` }}
                      whileHover={{ scale: 1.12, boxShadow: `0 0 20px ${color}50` }}
                    >
                      {icon}
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-bold text-foreground hover:underline transition-colors" style={{ color }}>
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-foreground">{value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <motion.div
              className="p-5 rounded-2xl flex items-center gap-4"
              style={{
                background: "oklch(0.65 0.2 180 / 0.08)",
                border: "1px solid oklch(0.65 0.2 180 / 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: "oklch(0.65 0.2 180)" }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <div>
                <p className="text-sm font-bold" style={{ color: "oklch(0.55 0.16 180)" }}>Available for Work</p>
                <p className="text-xs text-muted-foreground">Open to new opportunities</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:col-span-3 p-7 rounded-3xl border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Send a Message</h3>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Your Name</label>
                <input
                  {...form.register("name")}
                  className={`${inputClass} h-13`}
                  placeholder="Write your name here"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-xs font-semibold mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <input
                  {...form.register("email")}
                  className={`${inputClass} h-13`}
                  placeholder="Write your email here"
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-xs font-semibold mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Message</label>
                <textarea
                  {...form.register("message")}
                  className={`${inputClass} h-36 py-4 resize-none`}
                  placeholder="Write your message here"
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-xs font-semibold mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              {/* Success / Error */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2 ${
                    successMsg.toLowerCase().includes("success")
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {successMsg}
                </motion.div>
              )}

              {/* Submit */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 text-base rounded-2xl font-bold shadow-xl transition-all"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "0 8px 30px oklch(0.55 0.24 295 / 0.35)",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      Sending...
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
