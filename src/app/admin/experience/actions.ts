"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function addExperience(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const company = formData.get("company") as string
  const role = formData.get("role") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const description = formData.get("description") as string
  const orderStr = formData.get("order") as string
  const order = parseInt(orderStr) || 0

  try {
    await prisma.experience.create({
      data: { company, role, startDate, endDate: endDate || null, description, order }
    })

    revalidatePath("/admin/experience")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding experience:", error)
    return { error: "Failed to add experience" }
  }
}

export async function deleteExperience(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    await prisma.experience.delete({
      where: { id }
    })

    revalidatePath("/admin/experience")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting experience:", error)
    return { error: "Failed to delete experience" }
  }
}

export async function getExperiences() {
  return await prisma.experience.findMany({
    orderBy: { order: "asc" }
  })
}
