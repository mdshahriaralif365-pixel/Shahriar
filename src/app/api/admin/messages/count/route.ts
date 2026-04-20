import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const count = await prisma.message.count({
      where: { isRead: false }
    })
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 })
  }
}
