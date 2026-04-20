"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function getResetQuestions(email: string) {
  if (!email) return { error: "Email is required" }

  const normalizedEmail = email.toLowerCase().trim()
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { 
      securityAnswers: {
        include: { question: true }
      } 
    }
  })

  if (!user) {
    return { error: "No user found with this email." }
  }

  if (user.securityAnswers.length < 3) {
    return { error: "Security reset is not active. You must have at least 3 security questions answered to use this feature. Please contact support or login via alternative methods." }
  }

  // System check: Question pool must have at least 3 questions
  const poolCount = await prisma.securityQuestion.count()
  if (poolCount < 3) {
    return { error: "Safety system is currently disabled. Try again later." }
  }

  // Select 2 random questions from the user's answered set
  const shuffled = [...user.securityAnswers].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 2)

  return { 
    questions: selected.map(sa => ({
      id: sa.questionId,
      question: sa.question.question
    }))
  }
}

export async function verifySecurityAnswers(email: string, answers: { questionId: string, answer: string }[]) {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { securityAnswers: true }
    })

    if (!user) return { error: "User not found" }

    for (const provided of answers) {
      const stored = user.securityAnswers.find(sa => sa.questionId === provided.questionId)
      if (!stored) return { error: "Security check failed" }

      const isMatch = await bcrypt.compare(provided.answer.toLowerCase().trim(), stored.answer)
      if (!isMatch) return { error: "Answers do not match. Access denied." }
    }

    return { success: true }
  } catch (error) {
    console.error("Verification error:", error)
    return { error: "An error occurred during verification" }
  }
}

export async function verifyAndReset(data: { 
  email: string, 
  answers: { questionId: string, answer: string }[],
  password: string 
}) {
  const { email, answers, password } = data

  const normalizedEmail = email.toLowerCase().trim()

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { securityAnswers: true }
  })

  if (!user) return { error: "User not found" }

  // Verify provided answers against hashed answers
  for (const provided of answers) {
    const stored = user.securityAnswers.find(sa => sa.questionId === provided.questionId)
    if (!stored) return { error: "Invalid verification state" }

    // Answers are lowercased and trimmed during initial save, so we do same for comparison
    const isMatch = await bcrypt.compare(provided.answer.toLowerCase().trim(), stored.answer)
    if (!isMatch) return { error: "Incorrect security answers. Please try again." }
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10)
  
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetToken: null, // Clear any old tokens
        resetTokenExpiry: null
      }
    })
    return { success: true }
  } catch (error) {
    console.error("Reset error:", error)
    return { error: "Failed to reset password" }
  }
}
