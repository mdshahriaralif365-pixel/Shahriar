"use server"

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long")
});

export async function submitContact(formData: z.infer<typeof contactSchema>) {
  try {
    const validatedData = contactSchema.parse(formData);
    // এই জায়গায় বাস্তবে Resend, Sendgrid বা Nodemailer ইমেইল সার্ভিস ব্যবহার করা হবে।
    // আপাতত আমরা ১.৫ সেকেন্ডের ডামি লোডিং দেখাচ্ছি।
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Contact form submitted:", validatedData);
    
    return { success: true, message: "Thank you! Your message sent successfully!" };
  } catch {
    return { success: false, message: "Validation failed or server error." };
  }
}
