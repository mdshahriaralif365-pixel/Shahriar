import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        _count: {
          select: { securityAnswers: true }
        }
      }
    })
    
    return NextResponse.json({ count: user?._count.securityAnswers || 0 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 })
  }
}
