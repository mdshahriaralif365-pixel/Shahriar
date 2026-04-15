import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newEmail, newName, password } = await req.json();

    // Find user by ID instead of email to avoid issues when email is changed
    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify password before allowing email change
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    // Check if new email is already taken by another user
    if (newEmail && newEmail !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: newEmail },
      });
      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { 
        email: newEmail || user.email,
        name: newName || user.name
      },
    });

    return NextResponse.json({ message: "Profile updated successfully. Please log in again if you changed your email." });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
