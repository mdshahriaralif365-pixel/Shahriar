"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const MOCK_TESTIMONIALS = [
  {
    id: "1",
    name: "John Doe",
    position: "CEO at TechFlow",
    text: "Shahriar is an incredibly talented developer. His attention to detail and ability to turn complex logic into clean, user-friendly UI is unmatched.",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    position: "Product Manager",
    text: "Working with Alif was a breeze. He consistently delivered high-quality code and always met deadlines. Highly recommended for any web projects!",
  },
  {
    id: "3",
    name: "David Smith",
    position: "Senior Designer",
    text: "As a designer, I'm very picky about how my designs are implemented. Shahriar nailed every single detail flawlessly with amazing animations.",
  }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative bg-secondary/10 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">What People Say</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm relative group hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(var(--primary),0.08)] transition-all duration-300"
            >
              <Quote className="absolute top-6 right-8 h-12 w-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
              <div className="mb-8 relative z-10">
                <p className="text-muted-foreground leading-relaxed italic">
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
              <div className="mt-auto flex items-center gap-4 relative z-10 border-t border-border/50 pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg text-primary border border-primary/20">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
