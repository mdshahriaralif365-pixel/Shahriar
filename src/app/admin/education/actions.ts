"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function addEducation(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const institution = formData.get("institution") as string
  const degree = formData.get("degree") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const description = formData.get("description") as string

  try {
    await prisma.education.create({
      data: { institution, degree, startDate, endDate: endDate || null, description: description || null }
    })

    revalidatePath("/admin/education")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding education:", error)
    return { error: "Failed to add education" }
  }
}

export async function deleteEducation(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    await prisma.education.delete({
      where: { id }
    })

    revalidatePath("/admin/education")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting education:", error)
    return { error: "Failed to delete education" }
  }
}
export async function getEducations() {
  return await prisma.education.findMany()
}
