"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send, MapPin, Mail, Phone } from "lucide-react"

import { Button } from "./ui/button"
import { submitContact } from "@/actions/contact"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setSuccessMsg("")
    
    // Server action কল করা হচ্ছে (ইমেইল সেন্ড করার জন্য)
    const res = await submitContact(values)
    
    setIsSubmitting(false)
    if (res.success) {
      setSuccessMsg(res.message)
      form.reset()
    } else {
      setSuccessMsg("Something went wrong, please try again.")
    }
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none -z-10" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">Get In Touch</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out. I&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-background/80 backdrop-blur-md p-8 lg:p-10 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-foreground mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground font-medium mb-1">Email Me</h4>
                    <a href="mailto:shahriar.alif@example.com" className="text-foreground font-semibold hover:text-primary transition-colors">
                      shahriar.alif@example.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 group">
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground font-medium mb-1">Call Me</h4>
                    <a href="tel:+8801234567890" className="text-foreground font-semibold hover:text-primary transition-colors">
                      +880 1234-567890
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground font-medium mb-1">Location</h4>
                    <p className="text-foreground font-semibold">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background p-8 lg:p-10 rounded-3xl border border-border/50 shadow-lg relative"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Name</label>
                <input 
                  {...form.register("name")}
                  className="w-full h-14 bg-secondary/30 border border-border/50 rounded-2xl px-5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                  placeholder="Your Name"
                />
                {form.formState.errors.name && <p className="text-destructive text-sm font-medium mt-1">{form.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <input 
                  {...form.register("email")}
                  className="w-full h-14 bg-secondary/30 border border-border/50 rounded-2xl px-5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                  placeholder="your.email@example.com"
                />
                {form.formState.errors.email && <p className="text-destructive text-sm font-medium mt-1">{form.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Message</label>
                <textarea 
                  {...form.register("message")}
                  className="w-full h-40 bg-secondary/30 border border-border/50 rounded-2xl p-5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-foreground"
                  placeholder="Tell me about your project..."
                />
                {form.formState.errors.message && <p className="text-destructive text-sm font-medium mt-1">{form.formState.errors.message.message}</p>}
              </div>

              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`p-4 rounded-xl text-sm font-bold border ${successMsg.includes("success") ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}
                >
                  {successMsg}
                </motion.div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg rounded-2xl font-bold tracking-wide">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    Sending... 
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"/>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Send Message <Send className="h-5 w-5" /></span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
