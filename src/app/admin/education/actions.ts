"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addEducation(formData: FormData) {
  const institute = formData.get("institute") as string
  const degree = formData.get("degree") as string
  const year = formData.get("year") as string

  await prisma.education.create({
    data: { institute, degree, year }
  })

  revalidatePath("/admin/education")
  revalidatePath("/")
}

export async function deleteEducation(id: string) {
  await prisma.education.delete({
    where: { id }
  })

  revalidatePath("/admin/education")
  revalidatePath("/")
}
