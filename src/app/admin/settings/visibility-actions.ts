"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getSectionVisibility() {
  const data = await prisma.sectionVisibility.findUnique({
    where: { id: "1" }
  })
  
  // Return default true if not created yet
  if (!data) {
    return {
      showAbout: true,
      showProject: true,
      showExp: true,
      showEdu: true,
      showSkill: true,
      showTesti: true,
      showContact: true
    }
  }
  return data
}

export async function updateSectionVisibility(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const showAbout = formData.get("showAbout") === "true"
  const showProject = formData.get("showProject") === "true"
  const showExp = formData.get("showExp") === "true"
  const showEdu = formData.get("showEdu") === "true"
  const showSkill = formData.get("showSkill") === "true"
  const showTesti = formData.get("showTesti") === "true"
  const showContact = formData.get("showContact") === "true"

  try {
    await prisma.sectionVisibility.upsert({
      where: { id: "1" },
      update: { showAbout, showProject, showExp, showEdu, showSkill, showTesti, showContact },
      create: { id: "1", showAbout, showProject, showExp, showEdu, showSkill, showTesti, showContact },
    })

    revalidatePath("/")
    revalidatePath("/admin")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating visibility:", error)
    return { error: "Failed to update section visibility" }
  }
}
