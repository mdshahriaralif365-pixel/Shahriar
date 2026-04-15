"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function addSkill(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const category = formData.get("category") as string

  try {
    await prisma.skill.create({
      data: { name, category }
    })

    revalidatePath("/admin/skills")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding skill:", error)
    return { error: "Failed to add skill" }
  }
}

export async function deleteSkill(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    await prisma.skill.delete({
      where: { id }
    })

    revalidatePath("/admin/skills")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting skill:", error)
    return { error: "Failed to delete skill" }
  }
}

export async function getSkills() {
  return await prisma.skill.findMany()
}
