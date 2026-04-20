"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getContactInfo() {
  const info = await prisma.contactInfo.findUnique({
    where: { id: "1" }
  })
  return info || { id: "1", email: "shahriar.alif@example.com", phone: "+880 1234-567890", location: "Dhaka, Bangladesh" }
}

export async function updateContactInfo(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const location = formData.get("location") as string

  try {
    await prisma.contactInfo.upsert({
      where: { id: "1" },
      update: { email, phone, location },
      create: { id: "1", email, phone, location },
    })

    revalidatePath("/")
    revalidatePath("/admin/contact")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating contact info:", error)
    return { error: "Failed to update contact information" }
  }
}
