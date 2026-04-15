"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function getSecurityQuestions() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return []

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  // Fetch questions and include the CURRENT user's answer if it exists
  const questions = await prisma.securityQuestion.findMany({
    include: {
      answers: {
        where: { userId: user?.id }
      }
    }
  })

  return questions.map((q: unknown) => {
    const question = q as { id: string; question: string; answers: { length: number } }
    return {
      id: question.id,
      question: question.question,
      hasAnswer: question.answers.length > 0
    }
  })
}

export async function addSecurityQuestion(questionId: string, answer: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Unauthorized" }

  if (!questionId || !answer) {
    return { error: "Question and Answer cannot be empty" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return { error: "User not found" }

  try {
    const hashedAnswer = await bcrypt.hash(answer.toLowerCase().trim(), 10)
    
    await prisma.userSecurityAnswer.create({
      data: {
        userId: user.id,
        questionId: questionId,
        answer: hashedAnswer
      }
    })

    revalidatePath("/admin/settings/security-questions")
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error) {
    console.error("Error adding security answer:", error)
    return { error: "Failed to save answer. Question might already be answered." }
  }
}

export async function updateSecurityQuestion(id: string, question: string, answer?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Unauthorized" }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return { error: "User not found" }

  try {
    // const data: Record<string, unknown> = { question }
    
    if (answer) {
      const hashedAnswer = await bcrypt.hash(answer.toLowerCase().trim(), 10)
      
      await prisma.userSecurityAnswer.upsert({
        where: { 
          userId_questionId: {
            userId: user.id,
            questionId: id
          }
        },
        update: { answer: hashedAnswer },
        create: { 
          userId: user.id, 
          questionId: id, 
          answer: hashedAnswer 
        }
      })
    }

    await prisma.securityQuestion.update({
      where: { id },
      data: { question }
    })

    revalidatePath("/admin/settings/security-questions")
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error) {
    console.error("Error updating security question:", error)
    return { error: "Failed to update question" }
  }
}

export async function deleteSecurityAnswer(questionId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Unauthorized" }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  try {
    await prisma.userSecurityAnswer.delete({
      where: { 
        userId_questionId: {
          userId: user?.id ?? "",
          questionId: questionId
        }
      }
    })
    revalidatePath("/admin/settings/security-questions")
    return { success: true }
  } catch (error) {
    console.error("Error deleting security answer:", error)
    return { error: "Failed to delete answer" }
  }
}
