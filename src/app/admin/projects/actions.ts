"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function addProject(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const techStack = formData.get("techStack") as string
  const liveDemo = formData.get("liveDemo") as string
  const github = formData.get("github") as string

  try {
    await prisma.project.create({
      data: {
        title,
        description,
        image: image || "bg-primary/20",
        techStack,
        liveDemo: liveDemo || null,
        github: github || null,
      }
    })

    revalidatePath("/admin/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding project:", error)
    return { error: "Failed to add project" }
  }
}

export async function deleteProject(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    await prisma.project.deleteMany({
      where: { id }
    })

    revalidatePath("/admin/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { error: "Failed to delete project" }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const techStack = formData.get("techStack") as string
  const liveDemo = formData.get("liveDemo") as string
  const github = formData.get("github") as string

  try {
    await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        image: image || "bg-primary/20",
        techStack,
        liveDemo: liveDemo || null,
        github: github || null,
      }
    })

    revalidatePath("/admin/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    return { error: "Failed to update project" }
  }
}

export async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  })
}
