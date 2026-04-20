"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getAboutData() {
  const data = await prisma.about.findUnique({
    where: { id: "1" }
  })
  return data
}

export async function updateAboutData(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const bio = formData.get("bio") as string
  const card1Title = formData.get("card1Title") as string
  const card1Desc = formData.get("card1Desc") as string
  const card2Title = formData.get("card2Title") as string
  const card2Desc = formData.get("card2Desc") as string
  const card3Title = formData.get("card3Title") as string
  const card3Desc = formData.get("card3Desc") as string

  try {
    await prisma.about.upsert({
      where: { id: "1" },
      update: { bio, card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc },
      create: { id: "1", bio, card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc },
    })

    revalidatePath("/")
    revalidatePath("/admin/about")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating about data:", error)
    return { error: "Failed to update About information" }
  }
}
