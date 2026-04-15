"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getSocialLinks() {
  const links = await prisma.socialLinks.findUnique({
    where: { id: "1" }
  })
  return links || { 
    id: "1",
    github: "https://github.com/shahriar-alif", 
    linkedin: "https://linkedin.com/in/shahriar-alif",
    twitter: null,
    facebook: null,
    instagram: null
  }
}

export async function updateSocialLinks(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const github = formData.get("github") as string
  const linkedin = formData.get("linkedin") as string
  const twitter = formData.get("twitter") as string
  const facebook = formData.get("facebook") as string
  const instagram = formData.get("instagram") as string

  try {
    await prisma.socialLinks.upsert({
      where: { id: "1" },
      update: { github, linkedin, twitter, facebook, instagram },
      create: { id: "1", github, linkedin, twitter, facebook, instagram },
    })

    revalidatePath("/")
    revalidatePath("/admin/social")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating social links:", error)
    return { error: "Failed to update social links" }
  }
}
