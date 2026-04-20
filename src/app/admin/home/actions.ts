"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getHeroData() {
  const data = await prisma.hero.findUnique({
    where: { id: "1" }
  })
  return data
}

export async function updateHeroData(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const welcomeText = formData.get("welcomeText") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const description = formData.get("description") as string
  const avatarText = formData.get("avatarText") as string
  const avatarSubtext = formData.get("avatarSubtext") as string
  const avatarImage = formData.get("avatarImage") as string
  const badge1 = (formData.get("badge1") as string) || "React"
  const badge2 = (formData.get("badge2") as string) || "Next.js"
  const badge3 = (formData.get("badge3") as string) || "Node.js"
  const showBadges = formData.get("showBadges") === "true"

  try {
    await prisma.hero.upsert({
      where: { id: "1" },
      update: { welcomeText, name, role, description, avatarText, avatarSubtext, avatarImage, badge1, badge2, badge3, showBadges },
      create: { id: "1", welcomeText, name, role, description, avatarText, avatarSubtext, avatarImage, badge1, badge2, badge3, showBadges },
    })

    revalidatePath("/")
    revalidatePath("/admin/home")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating hero data:", error)
    return { error: "Failed to update Home section" }
  }
}
