"use server"

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long")
});

export async function submitContact(formData: z.infer<typeof contactSchema>) {
  try {
    const validatedData = contactSchema.parse(formData);
    
    // Save message to database
    await prisma.message.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
      }
    });
    
    return { success: true, message: "Thank you! Your message sent successfully!" };
  } catch (error) {
    console.error("Contact submission error:", error);
    return { success: false, message: "Validation failed or server error." };
  }
}
