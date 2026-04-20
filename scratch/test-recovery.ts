import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testRecovery() {
  const email = 'shahriaralif365@gmail.com'
  console.log("Testing recovery for:", email)

  const user = await prisma.user.findUnique({
    where: { email },
    include: { 
      securityAnswers: {
        include: { question: true }
      } 
    }
  })

  if (!user) {
    console.error("User not found")
    return
  }

  console.log("Found user. Security answers count:", user.securityAnswers.length)

  if (user.securityAnswers.length < 5) {
    console.error("Not enough security answers")
    return
  }

  const sa = user.securityAnswers[0]
  console.log("Testing answer for question:", sa.question.question)
  
  // We can't know the plain text answer, but we can try to compare the stored hash with itself? 
  // No, bcrypt.compare needs plain text.
  // But we can check if the stored hash is valid.
  try {
    const isValid = await bcrypt.compare("test", sa.answer)
    console.log("Bcrypt comparison worked (though answer 'test' should fail):", isValid === false)
  } catch (e) {
    console.error("Bcrypt comparison crashed:", e)
  }
}

testRecovery().then(() => prisma.$disconnect())
