import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const settings = await prisma.footerSettings.findUnique({
      where: { id: "1" },
    })

    if (!settings) {
      // Create default settings if not exists
      const defaultSettings = await prisma.footerSettings.create({
        data: {
          id: "1",
          copyrightText: "All rights reserved © {year}.",
          builtWithText: "Built with ❤️ by",
          creditName: "Shahriar Alif",
          creditLink: "/",
        },
      })
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching footer settings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { copyrightText, builtWithText, creditName, creditLink } = body

    const updated = await prisma.footerSettings.upsert({
      where: { id: "1" },
      update: {
        copyrightText,
        builtWithText,
        creditName,
        creditLink,
      },
      create: {
        id: "1",
        copyrightText,
        builtWithText,
        creditName,
        creditLink,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating footer settings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
