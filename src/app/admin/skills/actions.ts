"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addSkill(formData: FormData) {
  const name = formData.get("name") as string
  const category = formData.get("category") as string

  await prisma.skill.create({
    data: { name, category }
  })

  revalidatePath("/admin/skills")
  revalidatePath("/")
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({
    where: { id }
  })

  revalidatePath("/admin/skills")
  revalidatePath("/")
}
