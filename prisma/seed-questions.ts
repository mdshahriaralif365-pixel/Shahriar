import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  "What is your favorite color?",
  "What was the name of your first pet?",
  "In which city were you born?",
  "What is your favorite teacher's name?",
  "What was your childhood nickname?",
  "What was the name of your first school?",
  "What is your favorite food?",
  "What is your favorite hobby?",
  "What is your mother's favorite dish?",
  "Who is your favorite poet?",
  "Who is your favorite singer?",
  "What is your favorite movie?",
  "Who is your favorite athlete?",
  "Where is your father's birthplace?",
  "What is your favorite fruit?",
  "What is your favorite flower?",
  "What was the model of your first phone?",
  "Which is your favorite season?",
  "What is your favorite travel destination?",
  "What was the color of your first bicycle?",
  "What is your best friend's name?",
  "What was your favorite school subject?",
  "What was the name of your high school?",
  "What is your favorite sport?",
  "What is your favorite car color?",
  "Who is your favorite cartoon character?",
  "What is your favorite storybook?",
  "What is your favorite chocolate?",
  "What is your favorite historical place?",
  "What is your favorite mode of transport?",
  "Which was the first country you visited abroad?",
  "What is your favorite river?",
  "What is your favorite fish?",
  "What is your favorite vegetable?",
  "What is your favorite perfume?",
  "Who was your childhood hero?",
  "What is your favorite musical instrument?",
  "What is your favorite festival?",
  "What is your favorite day of the week?",
  "What is your favorite month?",
  "Who is your favorite author?",
  "What is your favorite short quote?",
  "What is the name of your favorite place?",
  "What is your favorite sweet or dessert?",
  "What is your favorite tree?",
  "What is your favorite bird?",
  "What is your favorite animal?",
  "What is your favorite type of clothing?",
  "What is your favorite mobile app?",
  "What is your favorite website?"
]

async function main() {
  console.log("Seeding security questions...")
  for (const q of questions) {
    await prisma.securityQuestion.upsert({
      where: { question: q },
      create: { question: q },
      update: { question: q },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log("Seeding completed successfully.")
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
