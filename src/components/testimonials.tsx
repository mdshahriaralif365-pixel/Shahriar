"use client"

import { motion } from "framer-motion"
import { Quote, User } from "lucide-react"
import { SectionHeading } from "./about"
import Image from "next/image"

const MOCK_TESTIMONIALS = [
  {
    id: "1",
    name: "John Doe",
    role: "CEO, Tech Corp",
    content: "Shahriar is an exceptional developer. He delivered our project on time and the quality of work was beyond our expectations.",
    avatar: null,
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Product Manager, Design Studio",
    content: "Working with Shahriar was a breeze. He has a great eye for detail and perfectly understood our requirements.",
    avatar: null,
  },
  {
    id: "3",
    name: "Alex Johnson",
    role: "Full-Stack Developer",
    content: "One of the best developers I've collaborated with. His technical skills and problem-solving abilities are top-notch.",
    avatar: null,
  }
]

interface TestimonialData {
  id: string
  name: string
  role: string
  content: string
  avatar: string | null
}

const testimonialColors = [
  "oklch(0.55 0.24 295)",
  "oklch(0.65 0.2 180)",
  "oklch(0.7 0.2 340)",
]

export function Testimonials({ data }: { data?: TestimonialData[] }) {
  const testimonials = data && data.length > 0 ? data : MOCK_TESTIMONIALS

  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 80% 20%, oklch(0.7 0.2 340 / 0.05), transparent)",
        }}
      />

      <div className="container px-4 md:px-6 mx-auto">
        <SectionHeading 
          label="Testimonials" 
          title="What Clients Say" 
          subtitle="I take pride in building strong relationships with my clients and delivering exceptional results."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => {
            const color = testimonialColors[idx % testimonialColors.length]
            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative p-8 rounded-[2.5rem] border group card-hover flex flex-col"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  boxShadow: "0 10px 40px -10px oklch(0 0 0 / 0.05)",
                }}
                whileHover={{ borderColor: color + "40" }}
              >
                {/* Quote Icon */}
                <div 
                  className="absolute -top-4 right-2 sm:-right-2 md:-right-4 w-12 h-12 rounded-2xl flex items-center justify-center text-white rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-lg"
                  style={{ background: color, boxShadow: `0 8px 20px ${color}40` }}
                >
                  <Quote className="w-6 h-6 fill-current" />
                </div>

                {/* Content */}
                <p className="text-muted-foreground italic mb-8 leading-relaxed flex-grow">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center border"
                    style={{ background: color + "15", borderColor: color + "30" }}
                  >
                    {testimonial.avatar ? (
                      <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" style={{ color }} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
