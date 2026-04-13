"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addProject(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const techStack = formData.get("techStack") as string
  const liveDemo = formData.get("liveDemo") as string
  const github = formData.get("github") as string

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
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id }
  })

  revalidatePath("/admin/projects")
  revalidatePath("/")
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const techStack = formData.get("techStack") as string
  const liveDemo = formData.get("liveDemo") as string
  const github = formData.get("github") as string

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
}
