"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getSiteSettings() {
  const data = await prisma.siteSettings.findUnique({
    where: { id: "1" }
  })
  
  if (!data) {
    return {
      siteName: "Shahriar Alif",
      siteRole: "Full-Stack Web Developer",
      favicon: null
    }
  }
  return data
}

export async function updateSiteSettings(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const siteName = formData.get("siteName") as string
  const siteRole = formData.get("siteRole") as string
  const favicon = formData.get("favicon") as string

  try {
    await prisma.siteSettings.upsert({
      where: { id: "1" },
      update: { siteName, siteRole, favicon },
      create: { id: "1", siteName, siteRole, favicon },
    })

    revalidatePath("/")
    revalidatePath("/admin/settings")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating site settings:", error)
    return { error: "Failed to update site settings" }
  }
}
