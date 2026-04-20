import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found with this email" }, { status: 404 });
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save to DB
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    // Send Email
    await sendResetEmail(email, token);

    return NextResponse.json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
