"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addExperience(formData: FormData) {
  const company = formData.get("company") as string
  const role = formData.get("role") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const description = formData.get("description") as string
  const orderStr = formData.get("order") as string
  const order = parseInt(orderStr) || 0

  await prisma.experience.create({
    data: { company, role, startDate, endDate: endDate || null, description, order }
  })

  revalidatePath("/admin/experience")
  revalidatePath("/")
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({
    where: { id }
  })

  revalidatePath("/admin/experience")
  revalidatePath("/")
}
