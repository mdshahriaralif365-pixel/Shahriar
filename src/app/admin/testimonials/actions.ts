"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function addTestimonial(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const position = formData.get("position") as string
  const text = formData.get("text") as string
  const link = formData.get("link") as string

  try {
    await prisma.testimonial.create({
      data: { name, position, text, link: link || null }
    })

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error adding testimonial:", error)
    return { error: "Failed to add testimonial" }
  }
}

export async function deleteTestimonial(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    await prisma.testimonial.delete({
      where: { id }
    })

    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return { error: "Failed to delete testimonial" }
  }
}

export async function getTestimonials() {
  return await prisma.testimonial.findMany()
}
