"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getMessages() {
  return await prisma.message.findMany({
    orderBy: { createdAt: "desc" }
  })
}

export async function markAsRead(id: string) {
  await prisma.message.update({
    where: { id },
    data: { isRead: true }
  })
  revalidatePath("/admin/messages")
}

export async function deleteMessage(id: string) {
  await prisma.message.delete({
    where: { id }
  })
  revalidatePath("/admin/messages")
}

export async function getUnreadCount() {
  return await prisma.message.count({
    where: { isRead: false }
  })
}
